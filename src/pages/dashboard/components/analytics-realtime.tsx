import { useEffect, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { varAlpha } from 'minimal-shared/utils';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Icon } from '@iconify/react';

import { fShortenNumber } from 'src/utils/format-number';
import { SvgColor } from 'src/components/svg-color';
import { AnalyticsService } from '@src/services/analytics.service';

import type {
  IAnalyticsConfigModel,
  IAnalyticsRealtimeData,
} from '@src/types/analytics.type';

interface AnalyticsRealtimeProps {
  /** Render function receiving the widget cards to place inside Grid */
  children: (widgets: {
    activeUsers30min: React.ReactNode;
    activeUsersToday: React.ReactNode;
    topCountries: React.ReactNode;
    configSelect: React.ReactNode;
  }) => React.ReactNode;
}

export function AnalyticsRealtime({ children }: AnalyticsRealtimeProps) {
  const [configs, setConfigs] = useState<IAnalyticsConfigModel[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState('');
  const [realtimeData, setRealtimeData] = useState<IAnalyticsRealtimeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [configsLoading, setConfigsLoading] = useState(true);

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setConfigsLoading(true);
        const response = await AnalyticsService.getListConfig();
        if (response?.data) {
          const list: IAnalyticsConfigModel[] = Array.isArray(response.data)
            ? response.data
            : (response.data as any).data ?? [];

          const enabledConfigs = list.filter((c) => c.enable);
          setConfigs(enabledConfigs);

          if (enabledConfigs.length > 0) {
            setSelectedConfigId(enabledConfigs[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching analytics configs:', error);
      } finally {
        setConfigsLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const fetchRealtime = useCallback(async () => {
    if (!selectedConfigId) return;
    try {
      setLoading(true);
      const response = await AnalyticsService.getRealtimeReport(selectedConfigId);
      if (response?.data) {
        const d = response.data as any;
        setRealtimeData(d.data ?? d);
      }
    } catch (error) {
      console.error('Error fetching realtime data:', error);
      setRealtimeData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedConfigId]);

  useEffect(() => {
    fetchRealtime();
  }, [fetchRealtime]);

  useEffect(() => {
    if (!selectedConfigId) return undefined;
    const interval = setInterval(fetchRealtime, 60_000);
    return () => clearInterval(interval);
  }, [selectedConfigId, fetchRealtime]);

  if (configsLoading || configs.length === 0) return null;

  const countries = realtimeData?.countries ?? [];

  const configSelect = (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Select
        size="small"
        value={selectedConfigId}
        onChange={(e) => setSelectedConfigId(e.target.value)}
        sx={{ minWidth: 140, fontSize: 13, height: 32 }}
      >
        {configs.map((c) => (
          <MenuItem key={c._id} value={c._id}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
      <Tooltip title="Refresh">
        <IconButton onClick={fetchRealtime} disabled={loading} size="small">
          <Icon icon="solar:restart-bold" width={18} />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const activeUsers30min = (
    <RealtimeStatCard
      title="Active Now (30m)"
      total={realtimeData?.activeUsers30min ?? 0}
      loading={loading && !realtimeData}
      color="info"
      icon="solar:eye-bold"
    />
  );

  const activeUsersToday = (
    <RealtimeStatCard
      title="Active Today"
      total={realtimeData?.activeUsersToday ?? 0}
      loading={loading && !realtimeData}
      color="success"
      icon="solar:chart-bold"
    />
  );

  const topCountries = (
    <TopCountriesCard countries={countries} loading={loading && !realtimeData} />
  );

  return <>{children({ activeUsers30min, activeUsersToday, topCountries, configSelect })}</>;
}

function RealtimeStatCard({
  title,
  total,
  loading,
  color = 'primary',
  icon,
}: {
  title: string;
  total: number;
  loading: boolean;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  icon: string;
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[color].lightChannel, 0.48)})`,
      }}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>
        <Icon icon={icon} width={48} height={48} />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
        <Box sx={{ typography: 'h4' }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : fShortenNumber(total)}
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}

function TopCountriesCard({
  countries,
  loading,
}: {
  countries: { country: string; activeUsers: number }[];
  loading: boolean;
}) {
  const theme = useTheme();
  const maxVal = Math.max(...countries.map((d) => d.activeUsers), 1);

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: 'warning.darker',
        backgroundColor: 'common.white',
        backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette.warning.lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette.warning.lightChannel, 0.48)})`,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Top Countries
      </Typography>

      {loading ? (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress size={24} color="inherit" />
        </Box>
      ) : countries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No data
        </Typography>
      ) : (
        <Stack spacing={1.5}>
          {countries.slice(0, 5).map((item, idx) => (
            <Box key={item.country}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ fontSize: 13 }}>
                  <Box component="span" sx={{ opacity: 0.5, mr: 0.75, fontSize: 12 }}>
                    {idx + 1}.
                  </Box>
                  {item.country}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontSize: 13 }}>
                  {fShortenNumber(item.activeUsers)}
                </Typography>
              </Stack>
              <Box
                sx={{
                  mt: 0.5,
                  height: 4,
                  borderRadius: 1,
                  bgcolor: varAlpha(theme.vars.palette.warning.darkChannel, 0.16),
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    borderRadius: 1,
                    width: `${(item.activeUsers / maxVal) * 100}%`,
                    bgcolor: 'warning.dark',
                    transition: 'width 0.4s ease',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      )}

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: 'warning.main',
        }}
      />
    </Card>
  );
}
