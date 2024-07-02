/* eslint-disable no-nested-ternary */
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useReactToPrint } from 'react-to-print';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRef, useState, useEffect, useCallback } from 'react';

import {
  Box,
  Card,
  Stack,
  Table,
  Button,
  Dialog,
  Select,
  MenuItem,
  TableRow,
  Container,
  TableBody,
  TextField,
  TableCell,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  TableContainer,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import axiosClient from 'src/services/axios-client';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import PrintableCard from '../printable-card';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isAddFormValid, setIsAddFormValid] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionState, setActionState] = useState('');
  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [filterKecamatan, setFilterKecamatan] = useState('');
  const [filterDesa, setFilterDesa] = useState('');
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);

  const [cardOpen, setCardOpen] = useState(false);
  const [selectedCardUser, setSelectedCardUser] = useState(null);
  const [isFront, setIsFront] = useState(true);

  const printRef = useRef();

  const handleViewCard = (user) => {
    setSelectedCardUser(user);
    setCardOpen(true);
  };

  const [newUser, setNewUser] = useState({
    nama: '',
    nik: '',
    kecamatan_id: '',
    desa_id: '',
    alamat: '',
    phone: '',
    admin_create_id: 1,
    admin_update_id: 1,
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    const isValid =
      newUser.nama &&
      newUser.nik &&
      newUser.kecamatan_id &&
      newUser.desa_id &&
      newUser.alamat &&
      newUser.phone;
    setIsAddFormValid(isValid);
  }, [newUser]);

  useEffect(() => {
    if (newUser.kecamatan_id) {
      fetchVillages(newUser.kecamatan_id);
    }
  }, [newUser.kecamatan_id]);

  const fetchDistricts = async () => {
    setIsLoadingDistricts(true);
    try {
      const response = await axiosClient.get('/kecamatan');
      setDistricts(response.data);
      setIsLoadingDistricts(false);
    } catch (error) {
      console.error('Failed to fetch districts:', error);
    }
  };

  const fetchVillages = async (kecamatanId) => {
    setIsLoadingVillages(true);
    try {
      const response = await axiosClient.get(`/kecamatan/${kecamatanId}/desa`);
      setVillages(response.data);
    } catch (error) {
      console.error('Failed to fetch villages:', error);
    } finally {
      setIsLoadingVillages(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    if (filterKecamatan === '') {
      setFilterDesa('');
    }
    try {
      const response = await axiosClient.get('/users', {
        params: {
          kecamatan_id: filterKecamatan,
          desa_id: filterDesa,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [filterKecamatan, filterDesa]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((user) => user.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else if (selectedIndex === 0) {
      newSelected = selected.slice(1);
    } else if (selectedIndex === selected.length - 1) {
      newSelected = selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [...selected.slice(0, selectedIndex), ...selected.slice(selectedIndex + 1)];
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const validations = {
      nama: { maxLength: 50 },
      nik: { maxLength: 20 },
      alamat: { maxLength: 100 },
      phone: { maxLength: 14 },
    };

    if (validations[name] && value.length > validations[name].maxLength) {
      return;
    }

    if (name === 'kecamatan_id') {
      setNewUser((prevUser) => ({
        ...prevUser,
        kecamatan_id: value,
        desa_id: '',
      }));
    } else {
      setNewUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setCardOpen(false),
  });

  const handleSave = async () => {
    setConfirmAction(() => async () => {
      setIsLoadingAction(true);
      try {
        if (isEdit) {
          await axiosClient.put(`/users/${editUserId}`, newUser);
          toast.success('Keluarga berhasil diperbarui!');
        } else {
          await axiosClient.post('/users', newUser);
          toast.success('Keluarga berhasil disimpan!');
        }
        setOpen(false);
        setNewUser({
          nama: '',
          nik: '',
          kecamatan_id: '',
          desa_id: '',
          alamat: '',
          phone: '',
          admin_create_id: 1,
          admin_update_id: 1,
        });
        fetchUsers();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          if (error.response.data.message === 'The nik has already been taken.') {
            toast.error('NIK sudah terdaftar!');
          } else {
            toast.error(error.response.data.message);
          }
        } else {
          toast.error(isEdit ? 'Gagal memperbarui Keluarga!' : 'Gagal menyimpan Keluarga!');
        }
      } finally {
        setIsLoadingAction(false);
        setConfirmOpen(false);
      }
    });
    setConfirmOpen(true);
  };

  const handleAddUser = () => {
    setIsEdit(false);
    setEditUserId(null);
    setNewUser({
      nama: '',
      nik: '',
      kecamatan_id: '',
      desa_id: '',
      alamat: '',
      phone: '',
      admin_create_id: 1,
      admin_update_id: 1,
    });
    setActionState('add');
    setOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEdit(true);
    setEditUserId(user.id);
    setNewUser({
      nama: user.nama,
      nik: user.nik,
      kecamatan_id: user.kecamatan_id,
      desa_id: user.desa_id,
      alamat: user.alamat,
      phone: user.phone,
      admin_create_id: 1,
      admin_update_id: 1,
    });
    setActionState('edit');
    setOpen(true);
  };

  const handleDeleteUser = async (user) => {
    setConfirmAction(() => async () => {
      try {
        setIsLoadingAction(true);
        await axiosClient.delete(`/users/${user.id}`);
        toast.success(`${user.nama} berhasil dihapus!`);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error(`Gagal menghapus ${user.nama}!`);
      } finally {
        setIsLoadingAction(false);
        setConfirmOpen(false);
      }
    });
    setSelectedDeleteUser(user);
    setActionState('delete');
    setConfirmOpen(true);
  };

  const handleBatchDelete = () => {
    setConfirmAction(() => async () => {
      setIsLoadingAction(true);
      try {
        await axiosClient.delete('/batch-delete', {
          data: { user_ids: selected },
        });

        setUsers((prevUsers) => prevUsers.filter((user) => !selected.includes(user.id)));
        setSelected([]);
        toast.success('Keluarga yang dipilih berhasil dihapus!');
      } catch (error) {
        console.error('Failed to delete selected users:', error);
        toast.error('Gagal menghapus Keluarga yang dipilih!');
      } finally {
        setIsLoadingAction(false);
        setConfirmOpen(false);
      }
    });
    setActionState('batchDelete');
    setConfirmOpen(true);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Keluarga
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleAddUser}
        >
          Tambah Keluarga
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          filterKecamatan={filterKecamatan}
          filterDesa={filterDesa}
          onFilterName={handleFilterByName}
          onDeleteSelected={handleBatchDelete}
          onFilterKecamatan={(e) => {
            setFilterKecamatan(e.target.value);
            setFilterDesa('');
          }}
          onFilterDesa={(e) => setFilterDesa(e.target.value)}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                headLabel={[
                  { id: 'id', label: 'No. Registrasi', alignRight: false },
                  { id: 'nama', label: 'Nama', alignRight: false },
                  { id: 'nik', label: 'NIK', alignRight: false },
                  { id: 'kecamatan', label: 'Kecamatan', alignRight: false },
                  { id: 'desa', label: 'Desa', alignRight: false },
                  { id: 'alamat', label: 'Alamat', alignRight: false },
                  { id: 'nomorhp', label: 'Nomor HP', alignRight: false },
                  { id: '' },
                ]}
                rowCount={users.length}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleSort}
              />
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={12} align="center" style={{ padding: '20px 0' }}>
                      <ClipLoader size={50} />
                    </TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => {
                      const isSelected = selected.indexOf(user.id) !== -1;
                      return (
                        <UserTableRow
                          key={user.id}
                          user={user}
                          handleClick={(event) => handleClick(event, user.id)}
                          selected={isSelected}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          onViewCard={handleViewCard}
                        />
                      );
                    })
                )}
                {users.length === 0 && !isLoadingUsers && <TableEmptyRows />}
                {notFound && users.length !== 0 && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Keluarga' : 'Tambah Keluarga'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Nama"
            name="nama"
            fullWidth
            value={newUser.nama}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            label="NIK"
            name="nik"
            type="number"
            fullWidth
            value={newUser.nik}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Kecamatan</InputLabel>
            <Select
              name="kecamatan_id"
              value={newUser.kecamatan_id}
              onChange={handleInputChange}
              label="Kecamatan"
              disabled={isLoadingDistricts}
              startAdornment={isLoadingDistricts && <CircularProgress size={20} />}
            >
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="desa-label">Desa</InputLabel>
            <Select
              label="Desa"
              id="desa"
              name="desa_id"
              value={newUser.desa_id}
              onChange={handleInputChange}
              disabled={isLoadingVillages || newUser.kecamatan_id === ''}
              startAdornment={isLoadingVillages && <CircularProgress size={20} />}
            >
              {villages.map((village) => (
                <MenuItem key={village.id} value={village.id}>
                  {village.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Alamat"
            name="alamat"
            fullWidth
            value={newUser.alamat}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            label="Nomor HP"
            name="phone"
            type="number"
            inputProps={{ maxLength: 13 }}
            fullWidth
            value={newUser.phone}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isAddFormValid || isLoadingAction}
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          <Typography>
            Anda yakin ingin{' '}
            {actionState === 'delete'
              ? `Hapus Keluarga ${selectedDeleteUser?.nama}?`
              : actionState === 'batchDelete'
              ? 'Hapus Keluarga yang dipilih?'
              : actionState === 'add'
              ? 'Simpan Keluarga baru?'
              : 'Perbarui Keluarga?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Tidak</Button>
          <Button disabled={isLoadingAction} variant="contained" onClick={confirmAction}>
            {isLoadingAction ? 'Loading...' : 'Iya'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cardOpen} onClose={() => setCardOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Kartu Keren
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant={isFront ? 'contained' : 'outlined'} onClick={() => setIsFront(true)}>
              {isFront ? 'Depan' : 'Depan'}
            </Button>
            <Button variant={!isFront ? 'contained' : 'outlined'} onClick={() => setIsFront(false)}>
              {!isFront ? 'Belakang' : 'Belakang'}
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              border: '2px solid #000',
              height: '520px',
            }}
          >
            {isFront ? (
              <Stack spacing={1} alignItems="center">
                <Box
                  component="img"
                  src="/assets/titlekeren.png"
                  alt="Title"
                  sx={{ width: 450, height: 150, py: 2 }}
                  draggable={false}
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
                        <Typography sx={{ width: '140px', fontSize: '1.4rem' }}>
                          {item.label}
                        </Typography>
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
                  draggable={false}
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
                  draggable={false}
                />
              </Stack>
            ) : (
              <Box
                component="img"
                src="/assets/kartubelakang.png"
                alt="Kartu Belakang"
                sx={{ width: '100%', height: '100%' }}
                draggable={false}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCardOpen(false)}>Tutup</Button>
          <Button onClick={handlePrint}>Cetak</Button>
        </DialogActions>
      </Dialog>
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={printRef} style={{ position: 'absolute' }}>
          <PrintableCard selectedCardUser={selectedCardUser} />
        </div>
      </div>
    </Container>
  );
}
