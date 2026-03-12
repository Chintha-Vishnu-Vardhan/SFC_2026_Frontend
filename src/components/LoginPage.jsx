import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Card,
    Typography,
    TextField,
    Button,
    Box,
    Link,
    IconButton,
    InputAdornment,
    Stack,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const normalizedUserId = userId.trim().toUpperCase();
            await login(normalizedUserId, password);
            navigate('/dashboard');
        } catch (errorMessage) {
            console.error('LoginPage: login error caught:', errorMessage);
            setError(errorMessage || 'Login failed. Please check credentials.');
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', py: 4 }}>
            <Card sx={{ p: { xs: 3, sm: 4 }, width: '100%', maxWidth: 520, borderRadius: 4 }}>
                <Stack spacing={0.5} sx={{ mb: 2 }}>
                    <Typography component="h1" variant="h4" sx={{ fontWeight: 800 }}>
                        Welcome back 👋
                    </Typography>
                    <Typography color="text.secondary">
                        Sign in to access your Shaastra Wallet and manage your virtual coupons.
                    </Typography>
                </Stack>

                <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="userId"
                        label="User ID (Roll Number)"
                        name="userId"
                        autoComplete="username"
                        autoFocus
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Typography color="error" align="left" variant="body2" sx={{ mt: 1.5 }}>
                            {error}
                        </Typography>
                    )}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 1.5, py: 1.2 }}>
                        Login
                    </Button>

                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                        <Link component={RouterLink} to="/forgot-password" variant="body2">
                            Forgot Password?
                        </Link>
                        <Link component={RouterLink} to="/register" variant="body2">
                            Don&apos;t have an account? Register
                        </Link>
                    </Stack>
                </Box>
            </Card>
        </Container>
    );
};

export default LoginPage;
