import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import { Tooltip } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

const kecamatanData = {
  1: { name: 'Bang Haji', color: '#1E88E5' }, // primary blue
  2: { name: 'Karang Tinggi', color: '#43A047' }, // success green
  3: { name: 'Merigi Kelindang', color: '#00ACC1' }, // info
  4: { name: 'Merigi Sakti', color: '#FB8C00' }, // warning
  5: { name: 'Pagar Jati', color: '#E53935' }, // error red
  6: { name: 'Pondok Kelapa', color: '#8E24AA' }, // secondary purple
  7: { name: 'Pondok Kubang', color: '#1E88E5' }, // primary blue
  8: { name: 'Pematang Tiga', color: '#43A047' }, // success green
  9: { name: 'Semidang Lagan', color: '#00ACC1' }, // info
  10: { name: 'Taba Penanjung', color: '#FB8C00' }, // warning
  11: { name: 'Talang Empat', color: '#E53935' }, // error red
};

export default function HistoryDaftarUser({ title, subheader, list, ...other }) {
  return (
    <Card
      {...other}
      sx={{
        pb: 5.4,
      }}
    >
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {list.map((item, index) => (
          <OrderItem key={item.id} item={item} lastTimeline={index === list.length - 1} />
        ))}
      </Timeline>
    </Card>
  );
}

HistoryDaftarUser.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

function OrderItem({ item, lastTimeline }) {
  const { type, title, time } = item;
  const kecamatan = kecamatanData[type] || { name: 'Unknown', color: '#000000' };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <Tooltip title={kecamatan.name} arrow>
          <TimelineDot sx={{ backgroundColor: kecamatan.color }} />
        </Tooltip>
        {lastTimeline ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  lastTimeline: PropTypes.bool,
};
