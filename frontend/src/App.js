import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
  IconButton,
  Fade,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Snackbar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  HelpOutline as HelpOutlineIcon,
  ContentCopy as ContentCopyIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  Code as CodeIcon,
  Article as ArticleIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [prompt, setPrompt] = useState('');
  const [contentType, setContentType] = useState('article');
  const [length, setLength] = useState(100);
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiModel, setAiModel] = useState('gpt2');
  const [apiKey, setApiKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Tema personalizado basado en el modo oscuro/claro
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#6C63FF' : '#2196F3',
          },
          secondary: {
            main: darkMode ? '#FF6584' : '#FF4081',
          },
          background: {
            default: darkMode ? '#1A1A1A' : '#F5F5F5',
            paper: darkMode ? '#2D2D2D' : '#FFFFFF',
          },
          text: {
            primary: darkMode ? '#FFFFFF' : '#000000',
            secondary: darkMode ? '#B0B0B0' : '#666666',
          },
        },
        typography: {
          fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
          h3: {
            fontWeight: 600,
            fontSize: '2.5rem',
          },
          h6: {
            fontWeight: 500,
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none',
                fontSize: '1rem',
                padding: '10px 20px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                boxShadow: darkMode 
                  ? '0 4px 20px rgba(0,0,0,0.25)'
                  : '0 4px 20px rgba(0,0,0,0.05)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 8,
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  const placeholders = {
    article: "Escribe un artículo sobre los beneficios de la meditación mindfulness en el lugar de trabajo, incluyendo estudios científicos y ejemplos prácticos.",
    story: "Crea una historia corta sobre un viajero del tiempo que accidentalmente llega a la antigua Roma y debe encontrar la manera de regresar sin alterar la historia.",
    poem: "Escribe un poema sobre la belleza de un amanecer en la playa, utilizando metáforas relacionadas con el mar y la luz.",
    script: "Desarrolla una escena de diálogo entre dos personajes que se reencuentran después de 20 años en una cafetería.",
    email: "Redacta un correo electrónico profesional para solicitar una reunión con un cliente potencial para presentar servicios de consultoría.",
    description: "Describe un producto innovador de tecnología wearable que combina monitoreo de salud con realidad aumentada."
  };

  const aiModels = [
    { value: 'gpt2', label: 'GPT-2', description: 'Modelo base de OpenAI para generación de texto', free: true },
    { value: 'bloom', label: 'BLOOM', description: 'Modelo multilingüe de código abierto', free: true },
    { value: 'gpt3', label: 'GPT-3', description: 'Modelo avanzado de OpenAI con mayor capacidad', free: false },
    { value: 'gpt4', label: 'GPT-4', description: 'Última versión del modelo GPT con capacidades multimodales', free: false },
    { value: 'llama2', label: 'LLaMA 2', description: 'Modelo de código abierto de Meta', free: false },
    { value: 'claude', label: 'Claude', description: 'Modelo de Anthropic con enfoque en seguridad', free: false },
    { value: 'deepseek', label: 'DeepSeek', description: 'Especializado en generación de código y texto técnico', free: false }
  ];

  // API keys predefinidas para modelos gratuitos
  const freeModelApiKeys = {
    'gpt2': 'demo_gpt2_key_123',
    'bloom': 'demo_bloom_key_456'
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Por favor, ingresa un prompt');
      return;
    }

    const selectedModel = aiModels.find(m => m.value === aiModel);
    const currentApiKey = selectedModel.free ? freeModelApiKeys[aiModel] : apiKey;
    
    if (!selectedModel.free && !currentApiKey.trim()) {
      setError('Por favor, ingresa una API key válida');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/generate', {
        prompt,
        content_type: contentType,
        length,
        model: aiModel,
        api_key: currentApiKey
      });
      setGeneratedContent(response.data.content);
    } catch (err) {
      setError('Error al generar contenido. Por favor, verifica tu API key y vuelve a intentar.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    setPrompt('');
  }, [contentType]);

  const contentTypeIcons = {
    article: <ArticleIcon />,
    story: <AutoAwesomeIcon />,
    poem: <LightbulbIcon />,
    script: <CodeIcon />,
    email: <ArticleIcon />,
    description: <AutoAwesomeIcon />,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                <AutoAwesomeIcon sx={{ mr: 2, fontSize: 40 }} />
                AI Content Generator
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleThemeToggle}
                    icon={<LightModeIcon />}
                    checkedIcon={<DarkModeIcon />}
                  />
                }
                label={darkMode ? "Modo Oscuro" : "Modo Claro"}
              />
            </Box>
          </motion.div>

          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Selección de Modelo IA */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Modelo de IA</InputLabel>
                <Select
                  value={aiModel}
                  label="Modelo de IA"
                  onChange={(e) => setAiModel(e.target.value)}
                >
                  {aiModels.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1">{model.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {model.description}
                          </Typography>
                        </Box>
                        {model.free && (
                          <Chip
                            label="Gratuito"
                            color="success"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* API Key Input */}
              <Fade in={!aiModels.find(m => m.value === aiModel)?.free}>
                <TextField
                  fullWidth
                  type="password"
                  label="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="Ingresa tu API key del modelo seleccionado"
                />
              </Fade>

              {/* Tipo de Contenido */}
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tipo de Contenido</InputLabel>
                <Select
                  value={contentType}
                  label="Tipo de Contenido"
                  onChange={(e) => setContentType(e.target.value)}
                >
                  {Object.entries(placeholders).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {contentTypeIcons[key]}
                        <Typography sx={{ ml: 1 }}>
                          {key === 'article' && 'Artículo'}
                          {key === 'story' && 'Historia'}
                          {key === 'poem' && 'Poema'}
                          {key === 'script' && 'Guión'}
                          {key === 'email' && 'Correo Electrónico'}
                          {key === 'description' && 'Descripción'}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Prompt Input con Tooltip */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <TextField
                  fullWidth
                  label="Prompt"
                  multiline
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={placeholders[contentType]}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
                <Tooltip title="Ver ejemplo de prompt" placement="right">
                  <IconButton
                    sx={{
                      position: 'absolute',
                      right: -40,
                      top: 0,
                      color: theme.palette.primary.main,
                    }}
                    onClick={() => setPrompt(placeholders[contentType])}
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <TextField
                fullWidth
                type="number"
                label="Longitud"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={loading}
                fullWidth
                sx={{
                  height: 50,
                  background: theme.palette.primary.main,
                  '&:hover': {
                    background: theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <AutoAwesomeIcon sx={{ mr: 1 }} />
                    Generar Contenido
                  </>
                )}
              </Button>
            </motion.div>
          </Paper>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {generatedContent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card elevation={3} sx={{ p: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        Contenido Generado:
                      </Typography>
                      <IconButton onClick={handleCopyContent}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                      {generatedContent}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          message="¡Contenido copiado al portapapeles!"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App; 