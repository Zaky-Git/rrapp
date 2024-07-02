import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Card, Stack, CircularProgress } from '@mui/material';

import axiosClient from 'src/services/axios-client';

import Iconify from 'src/components/iconify';

import AppSummary from '../app-summary';
import AppUserPerDesa from '../app-user-per-desa';
import HistoryDaftarUser from '../app-history-daftar-user';
import AppJumlahUserPerKecamatan from '../app-jumlah-per-kecamatan';

// ----------------------------------------------------------------------

export default function AppView() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    total_users: 0,
    total_kecamatan: 0,
    jumlah_user_per_kecamatan: [],
    history_daftar_user: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get('/dashboard-data');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleClickAddUser = () => {
    navigate('/user');
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Selamat Datang👋
      </Typography>

      {loading ? (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12} sm={12} md={3}>
            <Box sx={{ mb: 3 }}>
              <AppSummary
                title="Total User"
                total={dashboardData.total_users}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <AppSummary
                title="Total Kecamatan"
                total={dashboardData.total_kecamatan}
                color="success"
                icon={<img alt="icon" src="/assets/icons/glass/home.svg" />}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Card
                component={Stack}
                spacing={3}
                direction="row"
                sx={{
                  px: 3,
                  py: 8,
                  borderRadius: 2,
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={handleClickAddUser}
              >
                <Iconify icon="bi:person-plus-fill" color="primary" sx={{ fontSize: 40, mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Tambah User
                </Typography>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={9} lg={4}>
            <HistoryDaftarUser
              title="History Daftar User"
              list={dashboardData.history_daftar_user}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={5}>
            <AppJumlahUserPerKecamatan
              title="Jumlah User per Kecamatan"
              chart={{ series: dashboardData.jumlah_user_per_kecamatan }}
            />
          </Grid>

          <Grid xs={12} md={6} lg={12}>
            <AppUserPerDesa
              title="Jumlah User per Desa"
              subheader="Pilih Kecamatan"
              kecamatans={dashboardData.jumlah_user_per_kecamatan}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
