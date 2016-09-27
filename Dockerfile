############################################################
# Dockerfile to build SURFR Application Containers
# Based on Ubuntu
############################################################
# Set the base image to Ubuntu
FROM ubuntu

# File Author / Maintainer
MAINTAINER Mitch Sugden

# Install basic applications, Python, Python tools
RUN apt-get update && apt-get install -y \
build-essential \
curl \
dialog \
git \
net-tools \
tar 
# Install node
RUN apt-get install -y nodejs-legacy npm git git-core
# Install forever
RUN npm install forever -g
# Copy the application folder inside the container
ADD /SURFR /SURFR
# Expose ports
EXPOSE 80
# Set the default directory where CMD will execute
WORKDIR /SURFR
# Run server
CMD ["forever", "app.js"]