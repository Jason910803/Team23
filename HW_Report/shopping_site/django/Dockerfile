FROM python:3.12-slim

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends
apt-get install -y build-essential
rm -rf /var/lib/apt/lists/*
EOF

WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt 
COPY . .

EXPOSE 8000
