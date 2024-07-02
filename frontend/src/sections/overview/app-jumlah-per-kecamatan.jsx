import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { styled, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

const kecamatanData = {
  'Bang Haji': '#1E88E5', // primary blue
  'Karang Tinggi': '#43A047', // success green
  'Merigi Kelindang': '#FFC107', // warning yellow
  'Merigi Sakti': '#4CAF50', // success green
  'Pagar Jati': '#F44336', // error red
  'Pondok Kelapa': '#9C27B0', // purple
  'Pondok Kubang': '#03A9F4', // info blue
  'Pematang Tiga': '#FF5722', // deep orange
  'Semidang Lagan': '#607D8B', // blue grey
  'Taba Penanjung': '#FF9800', // orange
  'Talang Empat': '#9E9E9E', // grey
};

const getKecamatanColors = (series) => series.map((item) => kecamatanData[item.label] || '#000000');

export default function AppJumlahUserPerKecamatan({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const chartSeries = chart.series.map((item) => item.value);
  const chartColors = getKecamatanColors(chart.series);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors: chartColors,
    labels: chart.series.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5 }} />
      <StyledChart
        dir="ltr"
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width="100%"
        height={280}
      />
    </Card>
  );
}

AppJumlahUserPerKecamatan.propTypes = {
  chart: PropTypes.object.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
