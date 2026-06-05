variable "master_ip" {
  description = "IP du serveur master Kubernetes"
  type        = string
  default     = "192.168.56.10"
}

variable "worker_ip" {
  description = "IP du serveur worker Kubernetes"
  type        = string
  default     = "192.168.56.11"
}

variable "ssh_user" {
  description = "Utilisateur SSH des VMs"
  type        = string
  default     = "vagrant"
}
