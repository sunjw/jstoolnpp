<?php
$switch_app = "";
$header_title_app_list = "";

if ($current_app == "npp") {
    $switch_app = "<a class=\"switchApp\" href=\"../vsc/?redirect_src=".$current_app."\">JSTool for Visual Studio Code</a>";
    $header_title_app_list = "<a href=\"../npp/\">Notepad++</a> and <a href=\"../vsc/?redirect_src=".$current_app."\">Visual Studio Code</a>";
} else if ($current_app == "vsc") {
    $switch_app = "<a class=\"switchApp\" href=\"../npp/?redirect_src=".$current_app."\">JSTool for Notepad++</a>";
    $header_title_app_list = "<a href=\"../vsc/\">Visual Studio Code</a> and <a href=\"../npp/?redirect_src=".$current_app."\">Notepad++</a>";
}
?>
<div id="headerTitle">
    <div class="headerContent">
        <img id="logo" src="../imgs/icon_048.png"/>
        <div id="title">JSTool - A JavaScript tool for <?php echo $header_title_app_list; ?></div>
    </div>
</div>
<div id="navWrapper" class="appBorder">
    <div class="headerContent">
        <div id="navLeft">
            <a href="#top">
                <img id="logo" src="../imgs/icon_048.png"/>
            </a>
        </div>
        <ul id="navRight">
            <li>
                <?php echo $switch_app; ?>
            </li>
            <li>
                <a href="#help">Help</a>
            </li>
            <?php
if ($current_app == "npp") {
?>
            <li>
                <a href="#download">Download</a>
            </li>
<?php
} else if ($current_app == "vsc") {
?>
            <li>
                <a href="#install">Install</a>
            </li>
<?php
}
?>
            <li>
                <a href="#intro">Intro</a>
            </li>
        </ul>
        <div class="clear"></div>
    </div>
</div>
