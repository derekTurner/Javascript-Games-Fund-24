## Setting up PC 

To progress from using the playground Babylon can be set up on your local machine.  This can be done by setting up a node environment and installing the required modules.

Node can be used in several ways.

1. Install node on the windows machine and work  locally.  This will cause node modules to be installed locally with the drawback  they can be hard to delete and that it is difficult to maintain several projects at once which may need different node dependancies.

2. Use a linux installation on a separate dedicated machine.  This should work fine but still needs care to maintain different dependancies for separate projects.

3. Use linux running on a cloud based machine such as and AWS instance.  Again fine, but take care over back up.

4. Use linux running on a virtual machine locally.

5. Use a fully containerised environment within Docker.

6. Utilise the features of Visual Studio Code and Docker to open local files in a container as and when needed and copy these files to github (taking care not to copy node modules to github). This is my **preferred approach**.


This section describes the process of setting up Docker on a local PC together with useful programmes to interface between the editor and github.
The primary editor will be Visual Studio Code.
Docker containers will be used to manage the development environment.
Windows Subsystem for Linux WSL2 will be required to support Docker running Windows 11 (or windows 10).

## Visual Studio Code

Visual studio code is a lightweight code editor, that is what is required here.  This is not the same as Visual Studio which is an integrated development environment.  Please take care to install VSC and not VS!

Visual Studio Code can be downloaded [here](https://code.visualstudio.com/)

![download VSC](vscWebsite.png)

Open the extensions dialogue either by CTRL + Shift + X or clicking on the extensions icon on the left of the VSC display.

You will see a range of popular extensions which you can install.

If you don't see the extension you require listed you can just type the name in the extensions search bar.

Type Live Server in the search bar.

![Live Server extension](liveServerExt.png)

Installing  this will allow any website code in the editor to be previewed in a browser.

Further extensions will be installed to VSC as required.

## WSL 

Windows subsystem for Linux is easy to install on windows version beyond Windows 10 Home Version 21H1

The current system can be found in the windows setting system>about sectyion.  The system used a the time of writing these notes is:
```
    Edition: 	  Windows 11 Home

    Version:	  23H2

    OS build:	  22631.4317

    Experience:	Windows Feature Experience Pack 1000.22700.1041.0
```


WSL allows a command line linux distribution to be installed.  This is essentially needed to support the Docker application.

It is possible to go on to allow GUI linux applications to run on the PC, but this is not required for the present purpose.

Microsoft documents supporting WSL can be found [here](https://docs.microsoft.com/en-us/windows/wsl/).

Windows powershell is likely to be on a PC in version 5.1.  Version 7.4.5 is the current version and this features support for docker containers.  Microsoft documentation discusses how to [migrate from powershell 5.1 to Powershell 7](https://docs.microsoft.com/en-us/powershell/scripting/whats-new/migrating-from-windows-powershell-51-to-powershell-7)

I will [download Powershell 7](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) msi loader and install this with all default options along side powershell 5.1


## Updating existing installation

If you already have WSL installed you can check the version within powershell

> wsl --version

I am currently using
```code
WSL version: 2.3.24.0
Kernel version: 5.15.153.1-2
WSLg version: 1.0.65
MSRDC version: 1.2.5620
Direct3D version: 1.611.1-81528511
DXCore version: 10.0.26100.1-240331-1435.ge-release
Windows version: 10.0.22631.4317
```
If your version is older, the version of WSL can be updated by 

>wsl --update

As part of WSL you will have ubuntu.  In powershell (as administrator)

> ubuntu

> lsb_release -a

```code
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04 LTS
Release:        20.04
Codename:       focal
```
This is a long term support version, but not the latest.  Provided that I can remember my password I can update:

> sudo apt update && sudo apt upgrade

The process takes a while!

At the end of this I see

> lsb_release -a

```code
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.6 LTS
Release:        20.04
Codename:       focal
```

## WSL fresh install

However, if you don't have WSL you will need a fresh installation of WSL, so, open powershell *as an administrator* and enter the command:

> wsl --install

![powershell 7](powershell7.png)

The process takes a few minutes.

```code
PS C:\Windows\System32> wsl --install
Installing: Virtual Machine Platform
Virtual Machine Platform has been installed.
Installing: Windows Subsystem for Linux
Windows Subsystem for Linux has been installed.
Downloading: WSL Kernel
Installing: WSL Kernel
WSL Kernel has been installed.
Downloading: GUI App Support
Installing: GUI App Support
GUI App Support has been installed.
Downloading: Ubuntu
The requested operation is successful. Changes will not be effective until the system is rebooted.
PS C:\Windows\System32>
```

At this point a **system restart** is required.

When the computer restarts it opens a Linux window.

The default Linux distribution is Ubuntu.  Once it has loaded this will need a username and password.  Of course you should remember this!  However, there is advice [here](https://docs.microsoft.com/en-us/windows/wsl/setup/environment#set-up-your-linux-username-and-password) what to do if you forget your password.

![enter password](enterPassword.png)

Enter username and then password correctly typed twice.

```code
Installing, this may take a few minutes...
Please create a default UNIX user account. The username does not need to match your Windows username.
For more information visit: https://aka.ms/wslusers
Enter new UNIX username: derek
New password:
Retype new password:
passwd: password updated successfully
Installation successful!
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.10.16.3-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Mon Aug  8 15:06:01 BST 2022

  System load:  0.0                Processes:             8
  Usage of /:   0.4% of 250.98GB   Users logged in:       0
  Memory usage: 7%                 IPv4 address for eth0: 172.31.243.122
  Swap usage:   0%

0 updates can be installed immediately.
0 of these updates are security updates.


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


This message is shown once once a day. To disable it please create the
/home/derek/.hushlogin file.
derek@TurnerHub:~$
```
Note that you as a named user do not have full privelidges on the system.  This is reserved for the root user.  In general it is preferred not to go in as the root user to protect yourself from causing dabage from an unitentional code error.  If you need to do an operation which requires root privelidges you can use the sudo command.

Opening powerShell again, you can confirm which version of WSL you have with 

>wsl -l -v

WSL should be maintained in the background by windows update, but if you want to manually update you can enter in powershell (still as administrator)

> wsl --update

```code
PowerShell 7.3.6
PS C:\Users\username> wsl --update
Installing: Windows Subsystem for Linux
Windows Subsystem for Linux has been installed.
PS C:\Users\username>
PS C:\Users\username> wsl -l -v
  NAME                   STATE           VERSION
* Ubuntu                 Stopped         2
  docker-desktop         Stopped         2
  docker-desktop-data    Stopped         2
```

>wsl --shutdown

```code
  NAME      STATE           VERSION
* Ubuntu    Running         2
```




You won't need to do it, but if you want to see wsl running you can open it from the windows start menu by typing 
>wsl

```
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.15.90.1-microsoft-standard-WSL2 x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Wed Jul 19 09:53:13 BST 2023

  System load:  0.0                Processes:             9
  Usage of /:   0.5% of 250.92GB   Users logged in:       0
  Memory usage: 7%                 IPv4 address for eth0: 172.26.146.93
  Swap usage:   0%

0 updates can be installed immediately.
0 of these updates are security updates.


The list of available updates is more than a week old.
To check for new updates run: sudo apt update


This message is shown once once a day. To disable it please create the
/home/derek/.hushlogin file.
derek@TurnerHub:/mnt/c/WINDOWS/system32$
```

To check the  Ubunttu version:
>lsb_release -a

```
derek@TurnerHub:/mnt/c/WINDOWS/system32$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04 LTS
Release:        20.04
Codename:       focal
derek@TurnerHub:/mnt/c/WINDOWS/system32$
```

This is not the most recent version of Ubuntu, but I don't reccommend trying to change release version at this point.

You should close both powershell and the ubuntu window now.

## Docker

Docker Desktop is the windows installation which includes all you need to work with Docker containers.

Before using this you must check that virtualization is enabled in your BIOS.  

You should use CTRL + ALT + DEL to open task manager and look that virtualisation is enabled under the performance tab.

![virtualization enabled](virtualization.png)

Install docker from [Docker hub](https://docs.docker.com/desktop/install/windows-install/).


![download docker](downloadDocker.png) 

and install.

Installation runs through (the current version is 4.34.2):

![install docker](installDocker.png)

You must log out of windows to complete installation, so log out.  This is less drastic than a restart all you need to do is enter your pin to get back and the service agreement appears.

Note that docker is free for personal use and education.

![docker is free](dockerFree.png)

Startup docker desktop.

A whale icon appers in the system tray.  This animates whilst docker is starting.

![docker in system tray](dockerTray.png)

Right click the tray icon to see a menu.

![docker system tray menu](trayMenu.png)

At this point docker has not completed startup.  When startup is complete Docker desktop offers a tutorial - but dont follow this yet.  Click on the settings cog wheel icon next to the sign in.

Scroll down to see the default settings

![enable compose V2](enableComposeV2.png)

No need to change any of these settings.

Now you can quit docker desktop from the system tray menu.

![quit docker](quitDocker.png)

## Github

If you dont already have one, [open a github account](https://github.com/join?source=login).  I suggest using your email address as password.

When you join there is a short tutorial available to explain what gitHub is but from our point of view it is an online repository which will contain a copy of the code in the local folder which you wil be opening in your docker container.

![github home](githubHome.png)

## Github desktop

This is an application which is a convenience utility to help manage the maintenance of copies of the git repositories on your local machine.  I find it useful, it is not strictly necessary but easier than trying to manage git commands directly.


[Install Github desktop](https://desktop.github.com/)

![github desktop site](githubDesktopSite.png)

Once installed, you can sign into your gitHub account.

![Github Desktop Login](githubDesktopLogin.png)
]

You will be prompted to allow the desktop to open the github account online where you will be able to enter your login details.

![allo desktop to link to gitHub](allowGitHub.png)

Your gitHub user name name and email will appear in the configure git screen

click on "Finish"

![get Started](getStarted.png)

You can experiment with the tutorial repository, but for now installation is complete.

To log out (breaking the link to your online account and keeping your files safe) go to the File options menu or key in CTRL "+".

![sign out of github](signout.png)

You can close github desktop now.

## Git

Git is an application which will allow visual studio code to interact with GitHub Directly.  Github desktop has git built in, but to use it with VSC you must explicitly install git.

Undoubtedly you will decide wheter you prefer to manage your github files from Desktop or VSC, but to have both options available is useful.

The current version is 2.47.0

If you already have an older version of git installed, following these instructions will start by automatically removing it before making the new installation.  Setup will be automatic and you will not need to make menu selections again.

Download git [here](https://git-scm.com/).  You will find an online book on git here, but you dont need to issue git commands directly if you use VSC.

![git logo](git.png)

There is a 64-bit Git for windows setup.

Accept the default location.

![git location](gitLocation.png)

Accept the default components.

![git components](defaultComponents.png)

Accept the default Start folder.

![git start menu folder](startMenu.png)

Change the default editr from Vim to Visual Studio Code.

![default editor](gitEditor.png)

Change the name of the inital branch to "main"

![initial branch](initialBranch.png)

Accept the default path to allow git from powerShell.

![git command Line](commandLine.png)

Use the default bundled SSH shell.

![bundled shell](bundledShell.png)

Accept the default SSL library.

![sslLibrary](sslLibrary.png)

Accept the default windows style checkout.

![checkout windows style](checkout.png)

Use the default minTTY terminal emulator.

![terminal editor](terminal.png)

Accept default pull behaviour.

![pull behaviour](pullBehaviour.png)

Accept default credential manager.

![credential manager](credential.png)

Enable default file caching.

![default caching](caching.png)

Don't require experimental features.

![no experimental features](experimental.png)

Install.

When installation has completed, that is enough, no need to start now or view release notes.

![git completed](gitCompleted.png)

Finish!

Reload Visual Studio Code.

The source control icon in visual studio will now allow you to interact directly with gitHub.

![source control](sourceControl.png)

## VSC extensions

From the extensions menu search for the following useful extensions.

Docker

![docker extension](dockerExtension.png)

Dev containers: a plug in which incorporates 4 other plug ins for all remote container connections.

![remote containers](remoteContainers.png)

That is sufficient set up and these features will be used as the module progresses.