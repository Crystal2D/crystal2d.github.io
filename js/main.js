if (Application.isInCordova)
{
    document.addEventListener("deviceready", () => CrystalEngine.Inner.InitiateProgram());
    document.addEventListener("backbutton", event => event.preventDefault());
}
else window.onload = () => CrystalEngine.Inner.InitiateProgram();