import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Chip,
  useTheme,

  alpha
} from '@mui/material';
import {
  AccountBalanceWallet,
  ArrowUpward,
  ArrowDownward,
  CalendarToday
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import moment from 'moment';

export interface Transaction {
  amount: number;
  description: string;
  type: 'CREDIT' | 'DEBIT';
  date: string;
}

interface WalletProps {
  balance: number;
  transactions: Transaction[];
}

// Custom styled components
const BalanceCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.common.white,
  marginBottom: theme.spacing(3)
}));

const TransactionCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3)
}));

const TransactionItem = styled(ListItem)<{ transactiontype: 'CREDIT' | 'DEBIT' }>(
  ({ theme, transactiontype }) => ({
    borderRadius: 8,
    marginBottom: theme.spacing(1.5),
    transition: 'all 0.2s ease',
    backgroundColor: transactiontype === 'CREDIT' 
      ? alpha(theme.palette.success.light, 0.12)
      : alpha(theme.palette.error.light, 0.12),
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)'
    }
  })
);



const Wallet: React.FC<WalletProps> = ({ balance, transactions }) => {
  const theme = useTheme();
  
  
  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount);
  
  // Calculate summary statistics
  const totalIncome = transactions
    .filter(tx => tx.type === 'CREDIT')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpense = transactions
    .filter(tx => tx.type === 'DEBIT')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Balance Card */}
      <BalanceCard>
        <CardContent sx={{ py: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AccountBalanceWallet sx={{ fontSize: 36, mr: 2 }} />
            <Typography variant="h5" fontWeight="500">
              Wallet Balance
            </Typography>
          </Box>
          
          <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 3 }}>
            {formatINR(balance)}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <ArrowUpward sx={{ color: theme.palette.success.light, mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Income</Typography>
                  <Typography variant="h6">{formatINR(totalIncome)}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center">
                <ArrowDownward sx={{ color: theme.palette.error.light, mr: 1 }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Expenses</Typography>
                  <Typography variant="h6">{formatINR(totalExpense)}</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </BalanceCard>
      
      {/* Transactions Card */}
      <TransactionCard>
        <CardContent>
          <Typography variant="h6" fontWeight="500" gutterBottom>
            Transaction History
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          {transactions.length === 0 ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <Typography color="text.secondary">No transactions to display</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {sortedTransactions.map((tx, idx) => (
                <TransactionItem
                  key={idx}
                  transactiontype={tx.type}
                  disablePadding
                  sx={{ p: 2 }}
                >
                  <ListItemIcon>
                    <Avatar
                      sx={{
                        bgcolor: tx.type === 'CREDIT' 
                          ? theme.palette.success.main 
                          : theme.palette.error.main,
                        color: theme.palette.common.white
                      }}
                    >
                      {tx.type === 'CREDIT' ? <ArrowUpward /> : <ArrowDownward />}
                    </Avatar>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={tx.description.split('12:00')[0]}
                    secondary={
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption">
                          {moment(tx.date).format('DD MMM YYYY')}
                          
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight="500"
                      sx={{
                        color: tx.type === 'CREDIT' 
                          ? theme.palette.success.main 
                          : theme.palette.error.main
                      }}
                    >
                      {tx.type === 'CREDIT' ? '+' : '-'} {formatINR(tx.amount)}
                    </Typography>
                    
                    <Chip
                      size="small"
                      label={tx.type}
                      sx={{
                        mt: 1,
                        fontSize: '0.7rem',
                        bgcolor: tx.type === 'CREDIT' 
                          ? alpha(theme.palette.success.main, 0.2)
                          : alpha(theme.palette.error.main, 0.2),
                        color: tx.type === 'CREDIT' 
                          ? theme.palette.success.dark
                          : theme.palette.error.dark
                      }}
                    />
                  </Box>
                </TransactionItem>
              ))}
            </List>
          )}
        </CardContent>
      </TransactionCard>
    </Box>
  );
};

export default Wallet;