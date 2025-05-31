
import { Card, CardContent, Typography, Button, Box, Stack } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PdfFilePreview = () => {

  const fileUrl = 'https://res.cloudinary.com/dcoo56p7a/raw/upload/v1747639126/documents/uploads/67e27d48259143f7c6cddbb4-c061872cf47a46ee-1747639123.pdf';

  return (
    <Card sx={{ maxWidth: 500, display: 'flex', padding: 2, alignItems: 'center' }}>
      {/* PDF Icon */}
      <Box sx={{ mr: 2, color: 'red' }}>
        <PictureAsPdfIcon fontSize="large" />
      </Box>

      {/* File Info */}
      <CardContent sx={{ flex: '1 0 auto', padding: 0 }}>
        <Typography variant="subtitle1" noWrap>
         PDF DOCUMENT
        </Typography>
        <Typography variant="body2" color="text.secondary">
          PDF Document
        </Typography>

        {/* Buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open
          </Button>
          <Button
            size="small"
            variant="outlined"
            href={fileUrl}
            download
          >
            Save as...
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PdfFilePreview;
