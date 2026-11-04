/* ===== p25: ilustraciones de cebos y señuelos ===== */
var BAITIMG=["anchovy", "crank", "cuttle", "grub", "jig", "mackerel", "minnow", "mussel", "popper", "prawn", "sardine", "scrab", "shad", "shrimp", "shrimpb", "slug", "spoon", "squid", "squid2", "sshrimp", "stick", "swim", "sworm", "vib", "crab", "worm", "worm2", "limpet", "razor"];
var _baitIcon25=baitIcon;
baitIcon=function(name,cls){var k=baitIconKey(name);if(BAITIMG.indexOf(k)<0)return _baitIcon25(name,cls);return '<img class="bi'+(cls?' '+cls:'')+'" src="img/bait/'+k+'.webp" alt="" decoding="async">'};
var _st25=document.createElement('style');_st25.textContent='img.bi{object-fit:contain;flex:none;width:34px;height:28px;color:inherit}.btile img.bi{width:68px;height:46px}img.bi.mini{width:26px;height:18px;vertical-align:-4px;margin-right:4px}';document.head.appendChild(_st25);
