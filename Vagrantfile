# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  # Use Valtech Sweden's Ubuntu box, see https://vagrantcloud.com/valtech_sweden/ubuntu-trusty64
  config.vm.box = "valtech_sweden/ubuntu-trusty64"

  # Provision using shell script and apt-get
  config.vm.provision :shell, path: "bootstrap.sh"

  # Use synced folder with NFS for decreased latency
  config.vm.synced_folder ".", "/vagrant", type: "nfs"
  config.vm.network "private_network", ip: "10.11.12.13"

  # Forward port 3000 to guest
  config.vm.network :forwarded_port, host: 3000, guest: 3000

end
