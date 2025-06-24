import React, { useRef } from 'react';
import { Button, Stack } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { mockClients, mockTransactions } from './mockSearchData';
import { toast } from 'react-toastify';

const exportToExcel = (data: object[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
};

const exportToPDF = (data: object[], filename: string) => {
  const doc = new jsPDF();
  // @ts-ignore
  doc.autoTable({
    head: [Object.keys(data[0] || {})],
    body: data.map(obj => Object.values(obj)),
  });
  doc.save(filename);
};

const importFromExcel = (file: File, onImport: (data: any[]) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    onImport(json);
  };
  reader.readAsArrayBuffer(file);
};

const DataExportImport: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importFromExcel(file, (data) => {
        toast.success('Импортировано записей: ' + data.length);
        // TODO: обработать импортированные данные
      });
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
      <Button variant="contained" color="primary" onClick={() => { exportToExcel(mockClients, 'clients.xlsx'); toast.success('Клиенты экспортированы в Excel!'); }}>Экспорт клиентов (Excel)</Button>
      <Button variant="contained" color="secondary" onClick={() => { exportToExcel(mockTransactions, 'transactions.xlsx'); toast.success('Транзакции экспортированы в Excel!'); }}>Экспорт транзакций (Excel)</Button>
      <Button variant="outlined" color="primary" onClick={() => { exportToPDF(mockClients, 'clients.pdf'); toast.success('Клиенты экспортированы в PDF!'); }}>Экспорт клиентов (PDF)</Button>
      <Button variant="outlined" color="secondary" onClick={() => { exportToPDF(mockTransactions, 'transactions.pdf'); toast.success('Транзакции экспортированы в PDF!'); }}>Экспорт транзакций (PDF)</Button>
      <Button variant="contained" color="success" onClick={handleImportClick}>Импорт из Excel</Button>
      <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={handleFileChange} />
    </Stack>
  );
};

export default DataExportImport;
