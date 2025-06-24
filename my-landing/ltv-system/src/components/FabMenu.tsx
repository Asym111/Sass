import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CampaignIcon from '@mui/icons-material/Campaign';

interface FabMenuProps {
  onAddClient: () => void;
  onExport: () => void;
  onReport: () => void;
  onPromo: () => void;
}

const FabMenu: React.FC<FabMenuProps> = ({ onAddClient, onExport, onReport, onPromo }) => {
  const [open, setOpen] = useState(false);
  return (
    <SpeedDial
      ariaLabel="Быстрые действия"
      sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 2000 }}
      icon={<SpeedDialIcon openIcon={<AddIcon />} />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <SpeedDialAction
        icon={<AddIcon color="primary" />}
        tooltipTitle={<Tooltip title="Добавить клиента"><span>Добавить клиента</span></Tooltip>}
        onClick={onAddClient}
      />
      <SpeedDialAction
        icon={<FileDownloadIcon color="success" />}
        tooltipTitle={<Tooltip title="Экспорт/Импорт"><span>Экспорт/Импорт</span></Tooltip>}
        onClick={onExport}
      />
      <SpeedDialAction
        icon={<AssessmentIcon color="secondary" />}
        tooltipTitle={<Tooltip title="Отчёты"><span>Отчёты</span></Tooltip>}
        onClick={onReport}
      />
      <SpeedDialAction
        icon={<CampaignIcon color="warning" />}
        tooltipTitle={<Tooltip title="Генератор акций"><span>Генератор акций</span></Tooltip>}
        onClick={onPromo}
      />
    </SpeedDial>
  );
};

export default FabMenu;
