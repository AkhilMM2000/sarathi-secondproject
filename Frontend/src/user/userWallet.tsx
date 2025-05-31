import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
   
  Grid, 
  Skeleton, 
  Alert,
  Fade,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  AccountBalanceWallet as WalletIcon, 
  Refresh as RefreshIcon,
  History as HistoryIcon 
} from '@mui/icons-material';
import Wallet, { Transaction } from '../components/Wallet';
import EnhancedPagination from '../components/Adwancepagination';
import { UserAPI } from '../Api/AxiosInterceptor';

// Styled components
const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  background: theme.palette.background.paper,
}));

const UserWallet: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await UserAPI.get(`/wallet?page=${page}&limit=4`);
      setTransactions(res.data.transactionHistory.transactions);
      setWalletBalance(res.data.ballence);
      setTotalPages(res.data.transactionHistory.total);
    } catch (error: any) {
      console.error("Error fetching transactions:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "Failed to load wallet data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, refreshKey]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  // Display skeletons while loading
  const renderSkeletons = () => (
    <>
      <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 3 }} />
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
    </>
  );

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        <HeaderCard>
          <CardContent>
            <PageHeader>
              <Box display="flex" alignItems="center">
                <WalletIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 2 }} />
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  color="text.primary"
                >
                  Wallet Overview
                </Typography>
              </Box>
              
              {!loading && (
                <Box display="flex" alignItems="center" mt={isMobile ? 2 : 0}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Last updated: {new Date().toLocaleTimeString()}
                  </Typography>
                  <RefreshIcon 
                    onClick={handleRefresh}
                    sx={{ 
                      cursor: 'pointer', 
                      color: theme.palette.primary.main,
                      '&:hover': { color: theme.palette.primary.dark }
                    }} 
                  />
                </Box>
              )}
            </PageHeader>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <HistoryIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                  <Typography variant="body1" color="text.secondary">
                    View your transaction history and wallet balance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" justifyContent={isMobile ? "flex-start" : "flex-end"} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Showing {transactions.length} of {totalPages * 4} transactions
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </HeaderCard>

        {error && (
          <Fade in={!!error}>
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {loading ? renderSkeletons() : (
          <>
            <Wallet
              balance={walletBalance}
              transactions={transactions}
            />
            
            <Box display="flex" justifyContent="center" mt={4}>
              <EnhancedPagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Box>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default UserWallet;