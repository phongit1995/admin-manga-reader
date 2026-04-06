import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';
import { StatisticsService } from '@src/services';
import type { IStatisticsCommon } from 'src/types';

import { AnalyticsWidgetSummary } from './components/analytics-widget-summary';
import { AnalyticsRealtime } from './components/analytics-realtime';

export function OverviewAnalyticsView() {
  const [statistics, setStatistics] = useState<IStatisticsCommon | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await StatisticsService.getCommonStatistics();
        if (response.data) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Hi, Welcome back 👋
      </Typography>

      {statistics && (
        <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
          Statistics for {formatDate(statistics.date)}
        </Typography>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="New Users Today"
            percent={0}
            total={statistics?.usersCount || 0}
            color="secondary"
            icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Today'],
              series: [statistics?.usersCount || 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Manga Updates Today"
            percent={0}
            total={statistics?.mangasCount || 0}
            color="primary"
            icon={<img alt="Manga updates" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Today'],
              series: [statistics?.mangasCount || 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Novel Updates Today"
            percent={0}
            total={statistics?.novelsCount || 0}
            color="warning"
            icon={<img alt="Novel updates" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Today'],
              series: [statistics?.novelsCount || 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Purchases Today"
            percent={0}
            total={statistics?.purchasesCount || 0}
            color="error"
            icon={<img alt="Purchases" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Today'],
              series: [statistics?.purchasesCount || 0],
            }}
          />
        </Grid>
      </Grid>

      {/* Analytics Realtime — same grid style */}
      <AnalyticsRealtime>
        {({ activeUsers30min, activeUsersToday, topCountries, configSelect }) => (
          <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 5, mb: 3 }}>
              <Typography variant="h5">Realtime Analytics</Typography>
              {configSelect}
            </Stack>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {activeUsers30min}
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                {activeUsersToday}
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                {topCountries}
              </Grid>
            </Grid>
          </>
        )}
      </AnalyticsRealtime>
    </DashboardContent>
  );
}
