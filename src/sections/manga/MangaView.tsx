import { useEffect } from "react";
import { MangaService } from "@services/manga-service";

import { Box , Button , Typography } from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";

import { Iconify } from "src/components/iconify";

export default function MangaView() {
  useEffect(() => {
    MangaService.getListManga({ page: 1, pageSize: 10 }).then((res) => {
    });
  }, []);
    return (
        <DashboardContent>
            <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Manga List
        </Typography>
      </Box>
        </DashboardContent>
    )
}
