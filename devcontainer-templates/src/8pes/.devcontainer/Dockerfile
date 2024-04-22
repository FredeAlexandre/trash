# This is the base image of the 8pes development container
FROM ubuntu:24.04

# Some metadata about the image
LABEL name="8pes"
LABEL description="The official 8pes base image"
LABEL version="0.1.0"

# This configure apt to not ask for user input
ENV DEBIAN_FRONTEND noninteractive
ENV RUNNING_IN_DOCKER true

# Install all the basic packages
RUN \
  apt-get update && \
  apt-get -y install \
          zsh \
          sudo \
          curl \
          wget \
          perl \
          git \
          adduser \
          rsync \
          locales && \
  rm -rf /var/lib/apt/lists/*

# Set the locale
RUN locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

# Install starship
RUN curl -sS https://starship.rs/install.sh | sh -s -- -y

# Remove the default ubuntu user
RUN deluser --remove-home ubuntu

# Create the user
ARG USERNAME=${templateOption:username}
ARG PASSWORD=kingkong

ENV HOME /workspaces

RUN useradd -m -d $HOME -s /bin/zsh -G sudo $USERNAME && \
    echo "$USERNAME:$PASSWORD" | chpasswd
RUN echo "$USERNAME ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER $USERNAME

# Setup shell
ENV TERM xterm-256color
ENV SHELL /bin/zsh