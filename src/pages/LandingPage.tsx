import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Groups as GroupsIcon,
  Analytics as AnalyticsIcon,
  Integration as IntegrationIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DashboardIcon />,
      title: 'Intuitive Kanban Boards',
      description: 'Visualize your workflow with drag-and-drop boards that make project management effortless.',
    },
    {
      icon: <SpeedIcon />,
      title: 'Real-Time Collaboration',
      description: 'See changes instantly as your team works together. No refresh needed.',
    },
    {
      icon: <SecurityIcon />,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and compliance standards.',
    },
    {
      icon: <GroupsIcon />,
      title: 'Team Management',
      description: 'Invite team members, assign roles, and manage permissions with ease.',
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Advanced Analytics',
      description: 'Track productivity, monitor progress, and make data-driven decisions.',
    },
    {
      icon: <IntegrationIcon />,
      title: 'Google Calendar Integration',
      description: 'Sync tasks with your calendar and never miss a deadline again.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager at TechCorp',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'CollabTask transformed how our team collaborates. The real-time updates are game-changing.',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Engineering Lead at StartupXYZ',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'Finally, a project management tool that engineers actually enjoy using. Clean, fast, and powerful.',
    },
    {
      name: 'Jessica Park',
      role: 'Creative Director at Agency',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 5,
      text: 'The UI is beautiful and the workflow is so smooth. Our creative process has never been more organized.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Navigation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', py: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              CollabTask
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none' }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{ textTransform: 'none' }}
              >
                Get Started Free
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ pt: 12, pb: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(135deg, #4F46E5 0%, #F97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '3rem', md: '4rem' },
                  lineHeight: 1.1,
                }}
              >
                Work Together in Real-Time.
                <br />
                Anytime.
              </Typography>
              
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
              >
                The most intuitive collaborative task management platform. 
                Organize projects, sync with your team, and ship faster.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowIcon />}
                  onClick={() => navigate('/register')}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                  }}
                >
                  Start Free Trial
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 3,
                  }}
                >
                  View Demo
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Feature Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                p: 4,
                backgroundColor: 'background.paper',
                borderRadius: 4,
                boxShadow: 6,
                border: 1,
                borderColor: 'divider',
                mb: 8,
              }}
            >
              <Typography variant="h6" sx={{ textAlign: 'center', mb: 3, color: 'text.secondary' }}>
                Beautiful, intuitive interface that your team will love
              </Typography>
              <Box
                sx={{
                  height: 300,
                  backgroundColor: 'background.default',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  🎯 Interactive Demo Coming Soon
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Everything you need to succeed
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 6, maxWidth: 600, mx: 'auto' }}
            >
              From planning to delivery, CollabTask provides all the tools your team needs to stay productive and aligned.
            </Typography>

            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} lg={4} key={feature.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        p: 2,
                        borderRadius: 3,
                        border: 1,
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            mb: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: alpha => alpha('primary.main', 0.1),
                            color: 'primary.main',
                            display: 'inline-flex',
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                mb: 2,
                color: 'text.primary',
              }}
            >
              Loved by teams worldwide
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 6 }}
            >
              Join thousands of teams already using CollabTask to ship better products faster.
            </Typography>

            <Grid container spacing={4}>
              {testimonials.map((testimonial, index) => (
                <Grid item xs={12} md={4} key={testimonial.name}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 2,
                      }}
                    >
                      <CardContent>
                        <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic' }}>
                          "{testimonial.text}"
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={testimonial.avatar} alt={testimonial.name} />
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {testimonial.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {testimonial.role}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #4F46E5 0%, #F97316 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Ready to transform your workflow?
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                Join thousands of teams already using CollabTask.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/register')}
                sx={{
                  py: 2,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 3,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                  },
                }}
              >
                Get Started Free
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;