# ============================================
# SoftwareArceo - Docker Helper Script
# ============================================
# Uso: .\docker-helper.ps1 [comando]
# Ejemplo: .\docker-helper.ps1 start

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🐳 SoftwareArceo - Docker Helper" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Yellow
    Write-Host "  setup     - Configuración inicial (copia .env.example a .env)"
    Write-Host "  start     - Levantar todos los servicios"
    Write-Host "  stop      - Detener todos los servicios"
    Write-Host "  restart   - Reiniciar todos los servicios"
    Write-Host "  logs      - Ver logs de todos los servicios"
    Write-Host "  status    - Ver estado de los servicios"
    Write-Host "  clean     - Limpiar contenedores y volúmenes (⚠️ CUIDADO)"
    Write-Host "  rebuild   - Reconstruir y reiniciar servicios"
    Write-Host "  help      - Mostrar esta ayuda"
    Write-Host ""
}

function Setup-Environment {
    Write-Host "⚙️ Configurando entorno..." -ForegroundColor Cyan
    
    if (Test-Path ".env") {
        Write-Host "⚠️ El archivo .env ya existe. ¿Deseas sobrescribirlo? (s/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -ne "s" -and $response -ne "S") {
            Write-Host "❌ Operación cancelada" -ForegroundColor Red
            return
        }
    }
    
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado exitosamente" -ForegroundColor Green
    Write-Host "📝 Edita el archivo .env con tus credenciales antes de continuar" -ForegroundColor Yellow
}

function Start-Services {
    Write-Host "🚀 Levantando servicios..." -ForegroundColor Cyan
    
    if (-not (Test-Path ".env")) {
        Write-Host "❌ No se encontró el archivo .env. Ejecuta primero: .\docker-helper.ps1 setup" -ForegroundColor Red
        return
    }
    
    docker-compose up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Servicios levantados exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 URLs de acceso:" -ForegroundColor Cyan
        Write-Host "  Frontend:   http://localhost:5173"
        Write-Host "  Backend:    http://localhost:3000"
        Write-Host "  Keycloak:   http://localhost:8080"
        Write-Host "  PostgreSQL: localhost:5432"
        Write-Host ""
        Write-Host "📊 Para ver logs: .\docker-helper.ps1 logs" -ForegroundColor Yellow
    }
}

function Stop-Services {
    Write-Host "🛑 Deteniendo servicios..." -ForegroundColor Cyan
    docker-compose down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Servicios detenidos" -ForegroundColor Green
    }
}

function Restart-Services {
    Write-Host "🔄 Reiniciando servicios..." -ForegroundColor Cyan
    docker-compose restart
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Servicios reiniciados" -ForegroundColor Green
    }
}

function Show-Logs {
    Write-Host "📋 Mostrando logs (Ctrl+C para salir)..." -ForegroundColor Cyan
    docker-compose logs -f
}

function Show-Status {
    Write-Host "📊 Estado de los servicios:" -ForegroundColor Cyan
    Write-Host ""
    docker-compose ps
}

function Clean-Environment {
    Write-Host "⚠️ ADVERTENCIA: Esto eliminará todos los contenedores y volúmenes" -ForegroundColor Red
    Write-Host "⚠️ Se perderán todos los datos de la base de datos" -ForegroundColor Red
    Write-Host ""
    Write-Host "¿Estás seguro? Escribe 'CONFIRMAR' para continuar:" -ForegroundColor Yellow
    $response = Read-Host
    
    if ($response -eq "CONFIRMAR") {
        Write-Host "🧹 Limpiando entorno..." -ForegroundColor Cyan
        docker-compose down -v --remove-orphans
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Entorno limpiado" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Operación cancelada" -ForegroundColor Red
    }
}

function Rebuild-Services {
    Write-Host "🔨 Reconstruyendo servicios..." -ForegroundColor Cyan
    docker-compose down
    docker-compose up -d --build --force-recreate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Servicios reconstruidos" -ForegroundColor Green
    }
}

# Main switch
switch ($Command.ToLower()) {
    "setup" { Setup-Environment }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "clean" { Clean-Environment }
    "rebuild" { Rebuild-Services }
    "help" { Show-Help }
    default {
        Write-Host "❌ Comando desconocido: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
