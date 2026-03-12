import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container, Card, Typography, TextField, Button, Box, Link,
    IconButton, InputAdornment, Stack, Chip
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../api';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [smail, setSmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await api.post('/api/auth/forgot-password', { smail });
            setMessage(response.data.message);
            setStep(2);
        } catch (error) {
            setMessage('If this email is registered, a password reset OTP has been sent.');
            console.error('ForgotPasswordPage Request error:', error.response?.data || error.message);
            setStep(2);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const body = { smail, otp, newPassword };
            const response = await api.post('/api/auth/reset-password', body);
            setMessage(response.data.message + ' Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Password reset failed. OTP might be invalid or expired.');
            console.error('ForgotPasswordPage Reset error:', error.response?.data || error.message);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
            <Card sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 520, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                        Reset password
                    </Typography>
                    <Chip label={`Step ${step}/2`} color="secondary" size="small" />
                </Stack>

                {step === 1 ? (
                    <Box component="form" onSubmit={handleRequestReset} sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Enter your s-mail ID and we&apos;ll send an OTP to reset your password.
                        </Typography>
                        <TextField margin="normal" required fullWidth id="smail" label="Student Email (s-mail)" name="smail" type="email" autoComplete="email" autoFocus value={smail} onChange={(e) => setSmail(e.target.value)} />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                            Send Reset OTP
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Enter the OTP sent to {smail} and set your new password.
                        </Typography>
                        <TextField margin="normal" required fullWidth label="Student Email (s-mail)" name="smail" value={smail} disabled sx={{ mb: 1 }} />
                        <TextField margin="normal" required fullWidth name="otp" label="OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 1 }} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                            Reset Password
                        </Button>
                    </Box>
                )}

                {message && (
                    <Typography color={message.includes('successful') || message.includes('sent') ? 'success.main' : 'error'} align="left" variant="body2" sx={{ mt: 1 }}>
                        {message}
                    </Typography>
                )}

                <Link component={RouterLink} to="/login" variant="body2" sx={{ mt: 2 }}>
                    Back to Login
                </Link>
            </Card>
        </Container>
    );
};

export default ForgotPasswordPage;
