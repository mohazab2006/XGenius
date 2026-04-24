# XGenius API (FastAPI) — build from repository root: docker compose build
ARG PYTHON_VERSION=3.12
FROM python:${PYTHON_VERSION}-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Deps: wheels for numpy/scipy/sklearn are prebuilt; no compiler needed in most cases
COPY backend/requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# Application source (app package and data under backend/)
COPY backend/ /app/

EXPOSE 8000

# On first start, `PredictionService` will train and write `artifacts/` if missing
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
