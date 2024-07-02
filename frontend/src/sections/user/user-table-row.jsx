import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

export default function UserTableRow({
  selected,
  user,
  onEdit,
  onDelete,
  handleClick,
  onViewCard,
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    handleCloseMenu();
    onEdit(user);
  };

  const handleDelete = () => {
    handleCloseMenu();
    onDelete(user);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={selected}
            onChange={(event) => handleClick(event, user.id)}
          />
        </TableCell>

        <TableCell>{user.id}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" Wrap>
              {user.nama}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{user.nik}</TableCell>
        <TableCell>{user.kecamatan.nama}</TableCell>
        <TableCell>{user.desa.nama}</TableCell>
        <TableCell>{user.alamat}</TableCell>
        <TableCell>{user.phone}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => onViewCard(user)}>
          <Iconify icon="eva:credit-card-fill" sx={{ mr: 2 }} />
          Lihat Kartu
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  user: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  onViewCard: PropTypes.func.isRequired,
};
