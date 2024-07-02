/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import { CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import axiosClient from 'src/services/axios-client';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  numSelected,
  filterName,
  filterKecamatan,
  filterDesa,
  onFilterName,
  onFilterKecamatan,
  onFilterDesa,
  onDeleteSelected,
}) {
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (filterKecamatan) {
      fetchVillages(filterKecamatan);
    } else {
      setVillages([]);
    }
  }, [filterKecamatan]);

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      const response = await axiosClient.get('/kecamatan');
      setDistricts(response.data);
      setIsLoadingDistricts(false);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
      setIsLoadingDistricts(false);
    }
  };

  const fetchVillages = async (kecamatanId) => {
    setIsLoadingVillages(true);
    try {
      const response = await axiosClient.get(`/kecamatan/${kecamatanId}/desa`);

      setVillages(response.data);
      setIsLoadingVillages(false);
    } catch (error) {
      console.error('Failed to fetch villages:', error);
      setIsLoadingVillages(false);
    }
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack direction="row" spacing={2} alignItems="center">
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: 'text.disabled', width: 20, height: 20 }}
                />
              </InputAdornment>
            }
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Kecamatan</InputLabel>
            <Select
              value={filterKecamatan}
              onChange={onFilterKecamatan}
              label="Kecamatan"
              disabled={isLoadingDistricts}
              startAdornment={isLoadingDistricts && <CircularProgress size={20} />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} disabled={!filterKecamatan}>
            <InputLabel>Desa</InputLabel>
            <Select
              value={filterDesa}
              onChange={onFilterDesa}
              label="Desa"
              disabled={isLoadingVillages || filterKecamatan === ''}
              startAdornment={isLoadingVillages && <CircularProgress size={20} />}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {villages.map((village) => (
                <MenuItem key={village.id} value={village.id}>
                  {village.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteSelected}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="">
          <IconButton>
            <Iconify icon="ic:person" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterKecamatan: PropTypes.func,
  onFilterDesa: PropTypes.func,
  onDeleteSelected: PropTypes.func,
};
