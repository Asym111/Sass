import React, { useState } from 'react';
import { Box, TextField, MenuItem, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/SearchRounded';

const filterOptions = [
  { value: 'all', label: 'Все' },
  { value: 'charge', label: 'Начисления' },
  { value: 'writeoff', label: 'Списания' },
];

interface FiltersBarProps {
  onSearch: (query: string) => void;
  onFilter: (type: string) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  return (
    <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
      <TextField
        label="Поиск по клиентам/транзакциям"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton tabIndex={-1} edge="end" size="small">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 260 }}
      />
      <TextField
        select
        label="Тип транзакции"
        value={type}
        onChange={e => {
          setType(e.target.value);
          onFilter(e.target.value);
        }}
        size="small"
        sx={{ minWidth: 160 }}
      >
        {filterOptions.map(opt => (
          <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default FiltersBar;
