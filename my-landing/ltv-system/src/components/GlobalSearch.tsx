import React, { useState, useMemo } from 'react';
import { TextField, Paper, List, ListItem, ListItemText, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Fuse from 'fuse.js';

// Типы для поиска (пример)
export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
}
export interface Transaction {
  id: string;
  clientName: string;
  amount: number;
  type: string;
}

interface GlobalSearchProps {
  clients: Client[];
  transactions: Transaction[];
  onResultClick: (type: 'client' | 'transaction', id: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ clients, transactions, onResultClick }) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const fuseClients = useMemo(() => new Fuse(clients, { keys: ['name', 'phone', 'email'], threshold: 0.3 }), [clients]);
  const fuseTransactions = useMemo(() => new Fuse(transactions, { keys: ['clientName', 'amount', 'type'], threshold: 0.3 }), [transactions]);

  const clientResults = query ? fuseClients.search(query).map(r => ({ ...r.item, type: 'client' as const })) : [];
  const transactionResults = query ? fuseTransactions.search(query).map(r => ({ ...r.item, type: 'transaction' as const })) : [];
  const results = [...clientResults, ...transactionResults].slice(0, 8);

  return (
    <div style={{ position: 'relative', width: 340, margin: '0 16px' }}>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder="Поиск клиентов или транзакций..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ background: 'rgba(255,255,255,0.85)', borderRadius: 3 }}
      />
      {focused && results.length > 0 && (
        <Paper elevation={6} sx={{ position: 'absolute', top: 44, left: 0, right: 0, zIndex: 2000, maxHeight: 320, overflowY: 'auto' }}>
          <List>
            {results.map((item: any) => (
              <ListItem component="button" key={item.id + item.type} onMouseDown={() => onResultClick(item.type, item.id)}>
                <ListItemText
                  primary={item.type === 'client' ? `👤 ${item.name}` : `💸 ${item.clientName} — ${item.amount}₽`}
                  secondary={item.type === 'client' ? item.email : item.type}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default GlobalSearch;
