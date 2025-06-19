import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { Icon } from '@iconify/react';

import { DashboardContent } from 'src/layouts/dashboard';
import MangaChapterTable from './MangaChapterTable';
import { ERouterConfig } from 'src/config/router.config';

export default function MangaDetailView() {
    const { id: mangaId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        navigate(ERouterConfig.MANGA);
    };

    if (!mangaId) {
        return (
            <DashboardContent>
                <Typography color="error" variant="h6">
                    Error: Manga ID not found
                </Typography>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleBack}
                    startIcon={<Icon icon="eva:arrow-ios-back-fill" />}
                    sx={{ mr: 2 }}
                >
                    Back
                </Button>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>
                    Manga Detail
                </Typography>
            </Box>
            
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <MangaChapterTable mangaId={mangaId} />
            )}
        </DashboardContent>
    );
}
