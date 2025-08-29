import React from 'react';
import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 3,
          boxShadow: 2,
          border: 1,
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4,
            borderColor: `${color}.main`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha => alpha(`${color}.main`, 0.1),
                color: `${color}.main`,
              }}
            >
              {icon}
            </Box>
            {trend && (
              <Box
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  backgroundColor: trend.isPositive ? 'success.light' : 'error.light',
                  color: trend.isPositive ? 'success.dark' : 'error.dark',
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
            {value}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>

          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;