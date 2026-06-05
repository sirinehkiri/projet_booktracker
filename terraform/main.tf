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

# Récupérer automatiquement la dernière AMI Ubuntu 22.04
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical officiel

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Clé SSH
resource "aws_key_pair" "booktracker_key" {
  key_name   = "booktracker-key"
  public_key = file("~/.ssh/labsuser.pub")
}

# Security Group
resource "aws_security_group" "booktracker_sg" {
  name        = "booktracker-sg"
  description = "Security group pour BookTracker K8s"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 30081
    to_port     = 30081
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    self      = true
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Instance EC2 Master
resource "aws_instance" "master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.large"
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
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = "t2.medium"
  key_name               = aws_key_pair.booktracker_key.key_name
  vpc_security_group_ids = [aws_security_group.booktracker_sg.id]

  root_block_device {
    volume_size = 15
  }

  tags = {
    Name = "k8s-worker"
  }
}

# Inventory Ansible
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
