# Native resource loader. Each execution mounts separate real .gd resources;
# the class cache lets Godot resolve class_name, inheritance and cyclic types.
extends RefCounted
var generation := 0
var known_classes: Dictionary = {}

func prepare(files: Dictionary, entry: String = "main.gd") -> Dictionary:
    generation += 1
    var folder := "res://__gdh_project_%d/" % generation
    var staging := "user://gdh_project/"
    DirAccess.make_dir_recursive_absolute(staging)
    var filename_regex := RegEx.new()
    filename_regex.compile("^[a-zA-Z_][a-zA-Z0-9_]*\\.gd$")
    var name_regex := RegEx.new()
    name_regex.compile("(?m)^\\s*(?:@abstract\\s+)?class_name\\s+([A-Za-z_]\\w*)\\s*$")
    var parent_regex := RegEx.new()
    parent_regex.compile("(?m)^extends\\s+([A-Za-z_]\\w*)\\s*$")
    if files.is_empty() or files.size() > 16 or not files.has(entry):
        return {"status":"invalid_project", "message":"File del progetto mancanti"}
    var classes: Array = []
    var names: Dictionary = {}
    var total := 0
    for filename in files:
        if not filename is String or filename_regex.search(filename) == null or not files[filename] is String:
            return {"status":"invalid_project", "message":"Nome o contenuto del file non valido"}
        var source: String = files[filename]
        total += source.length()
        if source.length() > 16000 or total > 96000:
            return {"status":"invalid_project", "message":"Progetto troppo grande"}
        var found := name_regex.search(source)
        if found != null:
            var class_name_text := found.get_string(1)
            if names.has(class_name_text):
                return {"status":"invalid_project", "message":"Classe duplicata: " + class_name_text}
            names[class_name_text] = true
            var parent := parent_regex.search(source)
            var item := {"class":class_name_text,"base":parent.get_string(1) if parent != null else "RefCounted", "language":"GDScript", "path":folder+filename, "is_abstract":source.strip_edges().begins_with("@abstract"),"is_tool":false}
            classes.append(item)
            known_classes[class_name_text] = item
        # Relocate project-root resource paths into this execution's isolated root.
        # Source structure, class declarations and type annotations stay intact.
        source = source.replace('"res://', '"'+folder).replace("'res://", "'"+folder)
        var output := FileAccess.open(staging+filename,FileAccess.WRITE)
        if output == null:
            return {"status":"project_io_error", "message":"Impossibile preparare il file " + filename}
        output.store_string(source)
        output.close()
    # Old classes must not leak from a previous exercise into a new project.
    for old in known_classes:
        if not names.has(old):
            var tombstone: Dictionary = known_classes[old].duplicate()
            tombstone.path = folder+"__missing_"+old+".gd"
            classes.append(tombstone)
    var config := ConfigFile.new()
    config.set_value("", "list", classes)
    if config.save(staging+"classes.cfg") != OK:
        return {"status":"project_io_error", "message":"Impossibile preparare le classi"}
    var archive := staging+"project_%d.pck" % generation
    var pack := PCKPacker.new()
    if pack.pck_start(archive) != OK:
        return {"status":"project_io_error", "message":"Impossibile creare il progetto"}
    for filename in files:
        if pack.add_file(folder+filename,staging+filename) != OK:
            return {"status":"project_io_error", "message":"Impossibile aggiungere " + filename}
    pack.add_file("res://.godot/global_script_class_cache.cfg",staging+"classes.cfg")
    if pack.flush() != OK or not ProjectSettings.load_resource_pack(archive,true):
        return {"status":"project_io_error", "message":"Impossibile caricare le risorse"}
    var script = ResourceLoader.load(folder+entry,"GDScript",ResourceLoader.CACHE_MODE_IGNORE_DEEP)
    if script == null or not script.can_instantiate():
        return {"status":"compile_error", "message":"Controlla gli errori nei file del progetto"}
    return {"status":"prepared","script":script,"entry":folder+entry,"files":files.keys(),"nativeMultifile":true}
