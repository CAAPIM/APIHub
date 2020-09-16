# Use the official image as a parent image.
FROM centos:centos7.6.1810

RUN mkdir /develop

# Set the working directory.
WORKDIR /develop

# Run the command inside your image filesystem.
RUN yum -y install git

# Run the command inside your image filesystem.
RUN yum -y install make

RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -

RUN yum -y install nodejs

RUN npm -y install -g yarn

# Download git sources
#RUN git clone https://github.com/CAAPIM/APIHub.git

# Set the working directory.
WORKDIR /develop/APIHub

#RUN make install

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 3000

# Run the specified command within the container.
CMD [ "/bin/bash" ]

