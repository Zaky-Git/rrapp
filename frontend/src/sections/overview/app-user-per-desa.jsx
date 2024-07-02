import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber } from 'src/utils/format-number';

import axiosClient from 'src/services/axios-client';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function AppUserPerDesa({ title, subheader, kecamatans, ...other }) {
  const [selectedKecamatan, setSelectedKecamatan] = useState(
    kecamatans.length > 0 ? kecamatans[0].id_kecamatan : null
  );
  const [kecamatanData, setKecamatanData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedKecamatan !== null) {
      fetchKecamatanData(selectedKecamatan);
    }
  }, [selectedKecamatan]);

  const handleKecamatanChange = (event) => {
    const kecamatanId = event.target.value;
    setSelectedKecamatan(kecamatanId);
  };

  const fetchKecamatanData = async (kecamatanId) => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/users-per-desa/${kecamatanId}`);
      setKecamatanData(response.data);
    } catch (error) {
      console.error('Failed to fetch users per desa data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartSeries = kecamatanData.map((i) => i.value);
  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: () => '',
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '28%',
        borderRadius: 2,
      },
    },
    xaxis: {
      categories: kecamatanData.map((i) => i.label),
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3, my: 2 }}>
        <Select value={selectedKecamatan} onChange={handleKecamatanChange} displayEmpty fullWidth>
          {kecamatans.map((kecamatan) => (
            <MenuItem key={kecamatan.id_kecamatan} value={kecamatan.id_kecamatan}>
              {kecamatan.label}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ mx: 3 }}>
        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 364 }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Chart
            dir="ltr"
            type="bar"
            series={[{ data: chartSeries }]}
            options={chartOptions}
            width="100%"
            height={364}
          />
        )}
      </Box>
    </Card>
  );
}

AppUserPerDesa.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  kecamatans: PropTypes.array.isRequired,
};
