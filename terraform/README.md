# Terraform Infrastructure

## Overview

This directory contains modular Terraform code for provisioning a production-ready AWS infrastructure.

## Architecture

- **VPC**: Custom VPC with public and private subnets across multiple availability zones
- **Load Balancer**: Application Load Balancer with HTTPS support
- **Container Orchestration**: ECS Fargate for serverless container deployment
- **Registry**: ECR for storing Docker images
- **Monitoring**: CloudWatch for logs, metrics, and alarms
- **Auto-Scaling**: ECS service with auto-scaling policies

## Files

| File | Purpose |
|------|---------|
| `main.tf` | Provider configuration and local variables |
| `variables.tf` | Input variables and validation |
| `outputs.tf` | Output values |
| `vpc.tf` | VPC, subnets, NAT, routing |
| `security_groups.tf` | Security group definitions |
| `ecr.tf` | ECR repository and lifecycle policy |
| `alb.tf` | Application Load Balancer and TLS |
| `ecs.tf` | ECS cluster, service, tasks, auto-scaling |
| `cloudwatch.tf` | Dashboard and alarms |

## Prerequisites

- Terraform >= 1.0
- AWS CLI configured with appropriate credentials
- AWS account with permissions to create resources

## Quick Start

### 1. Initialize Terraform

```bash
terraform init
```

### 2. Review Configuration

```bash
terraform validate
terraform fmt -recursive
```

### 3. Create Variables File

```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### 4. Plan Deployment

```bash
terraform plan -out=tfplan
```

### 5. Apply Configuration

```bash
terraform apply tfplan
```

### 6. Get Outputs

```bash
terraform output
```

## Configuration

### Basic Variables

```hcl
aws_region     = "us-east-1"
project_name   = "devops-task"
environment    = "production"
vpc_cidr       = "10.0.0.0/16"
```

### Container Configuration

```hcl
container_port   = 3000        # Application port
container_cpu    = 256         # CPU units (256-4096)
container_memory = 512         # Memory in MB
```

### Auto-Scaling

```hcl
desired_count = 2              # Starting tasks
min_capacity  = 2              # Minimum tasks
max_capacity  = 4              # Maximum tasks
```

## Deployment

### Multi-Environment

```bash
# Dev environment
terraform workspace new dev
terraform var-file=dev.tfvars apply

# Production environment
terraform workspace new prod
terraform var-file=prod.tfvars apply
```

### Destroy Infrastructure

```bash
terraform destroy
```

## AWS Resources

### Network
- VPC (10.0.0.0/16)
- 2 Public Subnets (10.0.1.0/24, 10.0.2.0/24)
- 2 Private Subnets (10.0.10.0/24, 10.0.11.0/24)
- Internet Gateway
- NAT Gateway
- Route Tables with associations

### Load Balancer
- Application Load Balancer
- Target Group with health checks
- HTTPS Listener (self-signed cert for demo)
- HTTP to HTTPS redirect

### Container
- ECR Repository
- ECS Cluster
- ECS Task Definition
- ECS Service
- CloudWatch Log Group

### Security
- Security Group for ALB (HTTP/HTTPS)
- Security Group for ECS Tasks
- IAM Role for ECS Task Execution
- IAM Role for ECS Tasks

### Monitoring
- CloudWatch Dashboard
- CloudWatch Alarms (CPU, Memory, Unhealthy Targets)

### Auto-Scaling
- Application Auto Scaling Target
- Scaling Policy for CPU (target: 70%)
- Scaling Policy for Memory (target: 80%)

## State Management

### Local State (Default)

```hcl
# terraform.tf
terraform {
  required_version = ">= 1.0"
}
```

### Remote State (S3 Backend)

Create `backend.tf`:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}
```

Initialize:

```bash
terraform init
```

## Outputs

```bash
terraform output alb_dns_name
terraform output ecr_repository_url
terraform output ecs_cluster_name
terraform output ecs_service_name
terraform output cloudwatch_log_group
```

## Customization

### Add Environment Variables

Edit `ecs.tf`:

```hcl
environment = [
  {
    name  = "API_KEY"
    value = var.api_key
  }
]
```

### Change Instance Size

Edit `terraform.tfvars`:

```hcl
container_cpu    = 512
container_memory = 1024
```

### Add Database

Create `rds.tf`:

```hcl
resource "aws_db_instance" "main" {
  identifier     = "${local.name_prefix}-db"
  engine         = "postgres"
  instance_class = "db.t3.micro"
  # ... more configuration
}
```

## Debugging

### Enable Debug Logging

```bash
export TF_LOG=DEBUG
terraform apply
```

### Validate Syntax

```bash
terraform validate
terraform fmt
```

### Check State

```bash
terraform state list
terraform state show aws_ecs_service.app
```

## Cost Optimization

1. **Fargate Spot**: Use `FARGATE_SPOT` capacity provider (up to 70% savings)
2. **Reserved Capacity**: Reserve capacity in advance
3. **Lifecycle Policies**: Clean up old ECR images automatically
4. **Scheduled Scaling**: Scale down during off-hours

## Troubleshooting

### State Lock

```bash
terraform force-unlock LOCK_ID
```

### Resource Already Exists

```bash
terraform import aws_security_group.example sg-12345
```

### Plan Differences

```bash
terraform plan -out=tfplan
terraform show tfplan
```

## Best Practices

- ✅ Use `terraform.tfvars` for secrets (not version controlled)
- ✅ Use workspaces for multi-environment
- ✅ Enable state locking with DynamoDB
- ✅ Use remote state for team collaboration
- ✅ Tag all resources for cost tracking
- ✅ Use data sources for existing resources
- ✅ Version lock providers
- ✅ Plan before apply
- ✅ Regular state backups
- ✅ Document custom modules

## References

- [AWS Terraform Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/index.html)
- [ECS Fargate Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/what-is-fargate.html)

## License

MIT
