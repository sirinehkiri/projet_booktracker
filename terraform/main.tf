terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Clé SSH pour accéder aux instances
resource "aws_key_pair" "booktracker_key" {
  key_name   = "booktracker-key"
  public_key = file("~/.ssh/labsuser.pub")
}

# Security Group — règles réseau
resource "aws_security_group" "booktracker_sg" {
  name        = "booktracker-sg"
  description = "Security group pour BookTracker K8s"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes API
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend app
  ingress {
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API
  ingress {
    from_port   = 30081
    to_port     = 30081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Communication interne entre noeuds
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }

  # Tout le trafic sortant autorisé
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Instance EC2 Master
resource "aws_instance" "master" {
  ami                    = "ami-0c7217cdde317cfec" # Ubuntu 22.04 us-east-1
  instance_type          = "t2.large"              # 2 CPU, 4GB RAM
  key_name               = aws_key_pair.booktracker_key.key_name
  vpc_security_group_ids = [aws_security_group.booktracker_sg.id]

  root_block_device {
    volume_size = 20
  }

  tags = {
    Name = "k8s-master"
  }
}

# Instance EC2 Worker
resource "aws_instance" "worker" {
  ami                    = "ami-0c7217cdde317cfec"
  instance_type          = "t2.medium"
  key_name               = aws_key_pair.booktracker_key.key_name
  vpc_security_group_ids = [aws_security_group.booktracker_sg.id]

  tags = {
    Name = "k8s-worker"
  }
}

# Génère l'inventory Ansible avec les IPs publiques AWS
resource "local_file" "ansible_inventory" {
  filename = "../ansible/inventory.ini"
  content  = <<-EOT
    [master]
    ${aws_instance.master.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/labsuser.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
    [workers]
    ${aws_instance.worker.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/labsuser.pem ansible_ssh_common_args='-o StrictHostKeyChecking=no'
    [all:vars]
    ansible_python_interpreter=/usr/bin/python3
  EOT
}

output "master_ip" {
  value = aws_instance.master.public_ip
}

output "worker_ip" {
  value = aws_instance.worker.public_ip
}

output "app_url" {
  value = "http://${aws_instance.master.public_ip}:30080"
}
