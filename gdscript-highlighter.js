/**
 * Accessible, dependency-free GDScript syntax highlighting.
 * Keeps the native textarea as the only editable control, drawing safe
 * colored spans beneath it. Token text is always HTML-escaped.
 */
(function () {
    'use strict';
    const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
    const words = new Set([
        'extends','class_name','func','var','const','signal','enum','static','if','elif','else',
        'for','while','in','return','pass','break','continue','match','when','and','or','not',
        'as','is','await','self','super','true','false','null','preload','load','assert','void'
    ]);
    const types = new Set(['Node','Node2D','Control','Label','Button','Timer','Sprite2D',
        'Vector2','Vector3','Color','Array','Dictionary','String','int','float','bool',
        'PackedScene','Area2D','CharacterBody2D','RigidBody2D','Resource','RefCounted']);
    const funcs = new Set(['print','str','int','float','len','range','min','max',
        'abs','clamp','round','snapped','load','preload','get_node','has_node']);
    // Token order matters: comments and strings precede numbers / names.
    const token = /#[^\n]*|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|@[A-Za-z_]\w*|\$\w+(?:\/\w+)*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b/g;
    function kind(text, following) {
        if (text[0] === '#') return 'comment';
        if (text[0] === '"' || text[0] === "'") return 'string';
        if (text[0] === '@') return 'annotation';
        if (text[0] === '$') return 'node';
        if (/^\d/.test(text)) return 'number';
        if (text === 'true' || text === 'false' || text === 'null') return 'constant';
        if (words.has(text)) return 'keyword';
        if (types.has(text)) return 'type';
        if (funcs.has(text) || /^\s*\(/.test(following)) return 'function';
        return '';
    }
    function highlight(source) {
        // A real indent stays four actual spaces. Only the syntax layer displays
        // a small Godot-style arrow, so the submitted code is never modified.
        function leadingWhitespace(s) {
            let result='',i=0;
            while(i<s.length){
                if(s[i]==='\t'){result+='<span class="gdh-indent-unit">\t</span>';i++;continue;}
                if(s.slice(i,i+4)==='    '){result+='<span class="gdh-indent-unit">    </span>';i+=4;continue;}
                result+=escapeHtml(s[i]);i++;
            }
            return result;
        }
        const lines=String(source).split('\n');
        const rendered=lines.map(line=>{
            const lead=line.match(/^[ \t]*/)[0],rest=line.slice(lead.length);
            let result=leadingWhitespace(lead),cursor=0;
            token.lastIndex=0;
            let match;
            while((match=token.exec(rest))!==null){
                result+=escapeHtml(rest.slice(cursor,match.index));
                const value=match[0],css=kind(value,rest.slice(token.lastIndex,token.lastIndex+8));
                result+=css?'<span class="gd-token-'+css+'">'+escapeHtml(value)+'</span>':escapeHtml(value);
                cursor=token.lastIndex;
            }
            return result+escapeHtml(rest.slice(cursor));
        });
        return rendered.join('\n')+(source.endsWith('\n')?' ':'');
    }
    const targets = {
        exercise: ['code-editor','gdscript-syntax-layer','gdscript-highlight'],
        sandbox: ['sandbox-code-editor','sandbox-gdscript-syntax-layer','sandbox-gdscript-highlight']
    };
    function sync(which = 'exercise') {
        const ids=targets[which] || targets.exercise;
        const input=document.getElementById(ids[0]);
        const layer=document.getElementById(ids[1]);
        const pre=document.getElementById(ids[2]);
        if(!input||!layer)return;
        layer.innerHTML=highlight(input.value);
        if(pre){
            pre.scrollTop=input.scrollTop;
            pre.scrollLeft=input.scrollLeft;
        }
    }
    function init() {
        for(const [key,ids] of Object.entries(targets)){
            const input=document.getElementById(ids[0]);
            if(!input||input.dataset.syntaxLayerReady)continue;
            input.dataset.syntaxLayerReady='true';
            input.addEventListener('input',()=>sync(key));
            input.addEventListener('scroll',()=>sync(key));
            sync(key);
        }
    }
    window.GDScriptHighlighter = { init, sync, highlight };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else init();
})();