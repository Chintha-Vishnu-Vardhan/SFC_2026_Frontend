import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container, Card, Typography, TextField, Button, Box, Link,
    IconButton, InputAdornment, Stack, Chip
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import api from '../api';

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [smail, setSmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [sPin, setSPin] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const [showSPin, setShowSPin] = useState(false);
    const handleClickShowSPin = () => setShowSPin((show) => !show);
    const handleMouseDownSPin = (event) => event.preventDefault();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await api.post('/api/auth/request-otp', { smail });
            setMessage(response.data.message);
            setStep(2);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to request OTP. Please check the email and try again.');
            console.error('RegisterPage OTP Request error:', error.response?.data || error.message);
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const body = { smail, otp, password, sPin };
            const response = await api.post('/api/auth/complete-registration', body);
            setMessage(response.data.message + ' Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed. Please check OTP and password.');
            console.error('RegisterPage Completion error:', error.response?.data || error.message);
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
            <Card sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 520, borderRadius: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                        Create account
                    </Typography>
                    <Chip label={`Step ${step}/2`} color="primary" size="small" />
                </Stack>

                {step === 1 ? (
                    <Box component="form" onSubmit={handleRequestOtp} sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Use your official s-mail ID to receive a one-time verification code.
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="smail"
                            label="Student Email (s-mail)"
                            name="smail"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            value={smail}
                            onChange={(e) => setSmail(e.target.value)}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                            Get OTP
                        </Button>
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleCompleteRegistration} sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Enter the OTP sent to {smail}, then create your password and 4-digit S-Pin.
                        </Typography>
                        <TextField margin="normal" required fullWidth label="Student Email (s-mail)" name="smail" value={smail} disabled sx={{ mb: 1 }} />
                        <TextField margin="normal" required fullWidth name="otp" label="OTP" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} sx={{ mb: 1 }} />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="sPin"
                            label="New 4-Digit S-Pin"
                            type={showSPin ? 'text' : 'password'}
                            inputProps={{ maxLength: 4, minLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
                            autoComplete="new-password"
                            value={sPin}
                            onChange={(e) => setSPin(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton aria-label="toggle s-pin visibility" onClick={handleClickShowSPin} onMouseDown={handleMouseDownSPin} edge="end">
                                            {showSPin ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.2 }}>
                            Complete Registration
                        </Button>
                    </Box>
                )}

                {message && (
                    <Typography color={message.includes('successful') || message.includes('sent') ? 'success.main' : 'error'} align="left" variant="body2" sx={{ mt: 1 }}>
                        {message}
                    </Typography>
                )}

                <Link component={RouterLink} to="/login" variant="body2" sx={{ mt: 2 }}>
                    Already have an account? Login
                </Link>
            </Card>
        </Container>
    );
};

export default RegisterPage;
