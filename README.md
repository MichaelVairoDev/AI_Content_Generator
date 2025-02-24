# 🤖 AI Content Generator

## 📝 Descripción

Una aplicación moderna y potente de generación de contenido impulsada por IA, construida con React, FastAPI, y múltiples modelos de lenguaje. El proyecto incluye funcionalidades como generación de diferentes tipos de contenido, integración con múltiples modelos de IA, y una interfaz de usuario intuitiva con modo oscuro/claro.

### ✨ Características Principales

- 🎯 Generación de múltiples tipos de contenido:
  - 📰 Artículos
  - 📚 Historias
  - 📝 Poemas
  - 🎬 Guiones
  - ✉️ Correos electrónicos
  - 📋 Descripciones

- 🤖 Integración con múltiples modelos de IA:
  - GPT-2 (gratuito)
  - BLOOM (gratuito)
  - GPT-3
  - GPT-4
  - LLaMA 2
  - Claude
  - DeepSeek

- 🎨 Interfaz moderna y responsive:
  - 🌓 Tema claro/oscuro
  - 📱 Diseño adaptativo
  - ⚡ Animaciones fluidas
  - 🎯 UX intuitiva

## 📸 Capturas de Pantalla

### 🏠 Página Principal
![Página Principal](/screenshots/home.png)
_Interfaz principal en modo oscuro mostrando contenido generado_

### 📝 Página Principal mostrando el formulario de Generación de Contenido
![Página Principal mostrando el formulario de Generación de Contenido](/screenshots/home-models.png)
_Interfaz principal en modo oscuro mostrando contenido generado_

## 🚀 Tecnologías Utilizadas

### Frontend
- ⚛️ React.js
- 🎨 Material-UI
- 🔄 Framer Motion
- 🌐 Axios
- 🔒 TypeScript

### Backend
- 🐍 Python
- ⚡ FastAPI
- 🤖 Transformers
- 🧠 TensorFlow
- 🔒 JWT Auth

### DevOps
- 🐳 Docker y Docker Compose
- 🔄 Hot-reload en desarrollo
- 🔒 Variables de entorno
- 🌐 Nginx

## 📁 Estructura del Proyecto

```
AI_Content_Generator/
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── App.js          # Componente principal
│   │   └── index.js        # Punto de entrada
│   ├── public/             # Archivos estáticos
│   ├── Dockerfile          # Configuración Docker
│   └── nginx.conf          # Configuración Nginx
├── backend/                 # Servidor FastAPI
│   ├── main.py             # Aplicación principal
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile          # Configuración Docker
└── docker-compose.yml      # Configuración Docker Compose
```

## 🛠️ Requisitos Previos

- Docker y Docker Compose
- Node.js (versión 16 o superior)
- Python 3.9+
- npm o yarn

## ⚙️ Configuración del Proyecto

1. **Clonar el repositorio**

```bash
git clone <url-del-repositorio>
cd AI_Content_Generator
```

2. **Iniciar con Docker Compose**

```bash
# Construir e iniciar todos los servicios
docker compose up --build

# Iniciar en segundo plano
docker compose up -d

# Detener servicios
docker compose down

# Limpiar completamente y reconstruir
docker compose down -v && docker system prune -af && docker compose up -d --build
```

## 🚀 Acceso a la Aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Documentación API: http://localhost:8000/docs

## 🔌 API Endpoints Principales

### Generación de Contenido
- POST /generate - Generar contenido
- GET /models - Obtener modelos disponibles
- GET /health - Estado del servicio

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue describiendo el problema y cómo reproducirlo.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

⌨️ con ❤️ por [Michael Vairo]
