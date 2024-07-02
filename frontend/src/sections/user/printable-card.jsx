import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Typography } from '@mui/material';

const PrintableCard = ({ selectedCardUser }) => (
  <Box width={900}>
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '520px',
        backgroundColor: '#fff',
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Box
          component="img"
          src="/assets/titlekeren.png"
          alt="Title"
          sx={{ width: 450, height: 150, py: 2 }}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            component="img"
            src="/assets/logokeren.png"
            alt="Logo"
            sx={{ width: '250px', height: '250px' }}
            draggable={false}
          />
          <Box>
            {[
              { label: 'NIK', value: selectedCardUser?.nik },
              { label: 'Nama', value: selectedCardUser?.nama },
              { label: 'Kecamatan', value: selectedCardUser?.kecamatan.nama },
              { label: 'Desa/Kel', value: selectedCardUser?.desa.nama },
              { label: 'Alamat', value: selectedCardUser?.alamat },
              { label: 'No. Kartu', value: selectedCardUser?.id },
            ].map((item, index) => (
              <Box display="flex" key={index}>
                <Typography sx={{ width: '140px', fontSize: '1.4rem' }}>{item.label}</Typography>
                <Typography
                  sx={{
                    fontSize: '1.4rem',
                    maxWidth: '400px',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                    overflowWrap: 'break-word',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitLineClamp: 3,
                  }}
                >
                  : {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
        <Box
          component="img"
          src="/assets/wavekeren.png"
          alt="Wave"
          sx={{
            width: '400px',
            height: '150px',
            position: 'absolute',
            bottom: '0',
            left: '0',
          }}
        />
        <Box
          component="img"
          src="/assets/elementkeren.png"
          alt="Element"
          sx={{
            width: '160px',
            height: '180px',
            position: 'absolute',
            bottom: '0',
            right: '0',
          }}
        />
      </Stack>
    </Box>
    <Box
      mt={2}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        height: '520px',
      }}
    >
      <Box
        component="img"
        src="/assets/kartubelakang.png"
        alt="Kartu Belakang"
        sx={{ width: '100%', height: '100%' }}
      />
    </Box>
  </Box>
);

PrintableCard.propTypes = {
  selectedCardUser: PropTypes.object,
};

export default PrintableCard;
