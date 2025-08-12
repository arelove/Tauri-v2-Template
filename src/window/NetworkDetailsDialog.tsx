import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/core';
import { Box, IconButton, CircularProgress, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Extend Navigator interface to include connection (Network Information API)
interface NavigatorNetwork extends Navigator {
  connection?: {
    type?: string;
    downlink?: number;
    rtt?: number;
  };
}

interface NetworkDetails {
  online: boolean;
  interfaces: { name: string; ip: string }[];
  internet_accessible: boolean;
  ssid?: string;
  signal_strength?: number;
}

interface NetworkDetailsDialogProps {
  open: boolean;
  onClose: () => void;
}

const NetworkDetailsDialog: React.FC<NetworkDetailsDialogProps> = ({ open, onClose }) => {
  const { t } = useTranslation();
  const [networkDetails, setNetworkDetails] = useState<NetworkDetails | null>(null);
  const [isLoadingNetworkDetails, setIsLoadingNetworkDetails] = useState(false);

  const handleWifiClick = async () => {
    setIsLoadingNetworkDetails(true);
    try {
      const details: NetworkDetails = await invoke('get_network_details');
      setNetworkDetails(details);
    } catch (error) {
      console.error('Error fetching network details:', error);
      setNetworkDetails({
        online: navigator.onLine,
        interfaces: [],
        internet_accessible: false,
      });
    } finally {
      setIsLoadingNetworkDetails(false);
    }
  };

  // Fetch network details when dialog opens
  React.useEffect(() => {
    if (open) {
      handleWifiClick();
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          position: 'relative',
          padding: 2,
        },
      }}
    >
      <DialogTitle>
        {t('titlebar.networkDetails.title')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {isLoadingNetworkDetails ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : networkDetails ? (
          <>
            <Typography variant="body1">
              {t('titlebar.networkDetails.onlineStatus')}: {networkDetails.online ? t('titlebar.online') : t('titlebar.offline')}
            </Typography>
            {(navigator as NavigatorNetwork).connection && (
              <>
                <Typography variant="body1">
                  {t('titlebar.networkDetails.connectionType')}: {(navigator as NavigatorNetwork).connection?.type || t('titlebar.networkDetails.unknown')}
                </Typography>
                <Typography variant="body1">
                  {t('titlebar.networkDetails.downlink')}: {(navigator as NavigatorNetwork).connection?.downlink ? `${(navigator as NavigatorNetwork).connection!.downlink} Mbps` : t('titlebar.networkDetails.unknown')}
                </Typography>
                <Typography variant="body1">
                  {t('titlebar.networkDetails.rtt')}: {(navigator as NavigatorNetwork).connection?.rtt ? `${(navigator as NavigatorNetwork).connection!.rtt} ms` : t('titlebar.networkDetails.unknown')}
                </Typography>
              </>
            )}
            <Typography variant="body1">
              {t('titlebar.networkDetails.internetAccessible')}: {networkDetails.internet_accessible ? t('titlebar.networkDetails.yes') : t('titlebar.networkDetails.no')}
            </Typography>
            {networkDetails.ssid && (
              <Typography variant="body1">
                {t('titlebar.networkDetails.ssid')}: {networkDetails.ssid}
              </Typography>
            )}
            {networkDetails.signal_strength && (
              <Typography variant="body1">
                {t('titlebar.networkDetails.signalStrength')}: {networkDetails.signal_strength}%
              </Typography>
            )}
            {networkDetails.interfaces.length > 0 && (
              <>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {t('titlebar.networkDetails.interfaces')}
                </Typography>
                {networkDetails.interfaces.map((iface, index) => (
                  <Typography key={index} variant="body2">
                    {iface.name}: {iface.ip}
                  </Typography>
                ))}
              </>
            )}
          </>
        ) : (
          <Typography variant="body1">{t('titlebar.networkDetails.error')}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NetworkDetailsDialog;