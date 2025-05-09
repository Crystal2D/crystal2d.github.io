if (Application.isInCordova) document.addEventListener("deviceready", () => CrystalEngine.Inner.InitiateProgram());
else window.onload = () => CrystalEngine.Inner.InitiateProgram();