/* YasVerse — shader WebGL animé (fond du héro en clair, fond du contact en sombre, palette rose) */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

  function frag(base, c1, c2, c3) {
    return [
      'precision mediump float;',
      'uniform vec2 u_res;uniform float u_t;uniform vec2 u_m;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);',
      ' return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}',
      'void main(){',
      ' vec2 uv=gl_FragCoord.xy/u_res;',
      ' vec2 p=uv*vec2(u_res.x/u_res.y,1.);',
      ' float t=u_t*.05;',
      ' vec2 q=p+t;',
      ' q+=.32*vec2(fbm(q*1.35+t),fbm(q*1.35-t));',
      ' q=mix(q,q+(u_m-.5)*.55,.35);',
      ' vec3 col=' + base + ';',
      ' col=mix(col,' + c1 + ',smoothstep(.42,.95,fbm(q*1.6))*.38);',
      ' col=mix(col,' + c2 + ',smoothstep(.55,1.,fbm(q*1.15+3.7))*.30);',
      ' col=mix(col,' + c3 + ',smoothstep(.72,.99,fbm(q*.85+7.1))*.16);',
      ' gl_FragColor=vec4(col,1.);',
      '}'
    ].join('\n');
  }

  var PALETTES = {
    light: frag('vec3(.992,.972,.978)', 'vec3(.788,.388,.533)', 'vec3(.949,.773,.839)', 'vec3(.871,.784,.929)'),
    dark: frag('vec3(.196,.145,.188)', 'vec3(.914,.608,.718)', 'vec3(.439,.263,.365)', 'vec3(.843,.522,.620)'),
    night: frag('vec3(.082,.063,.102)', 'vec3(.78,.36,.52)', 'vec3(.36,.18,.30)', 'vec3(.42,.30,.62)')
  };

  function init(canvas) {
    var gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
    if (!gl) { canvas.style.display = 'none'; return; }
    function sh(type, s) {
      var o = gl.createShader(type);
      gl.shaderSource(o, s); gl.compileShader(o);
      return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : null;
    }
    var vs = sh(gl.VERTEX_SHADER, VERT);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var prog = null, uRes, uT, uM;
    function link(name) {
      var fs = sh(gl.FRAGMENT_SHADER, PALETTES[name] || PALETTES.light);
      if (!vs || !fs) return false;
      var p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return false;
      if (prog) gl.deleteProgram(prog);
      prog = p; gl.useProgram(prog);
      var loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uRes = gl.getUniformLocation(prog, 'u_res');
      uT = gl.getUniformLocation(prog, 'u_t');
      uM = gl.getUniformLocation(prog, 'u_m');
      return true;
    }
    if (!link(canvas.getAttribute('data-shader'))) { canvas.style.display = 'none'; return; }
    /* permet de changer de palette à chaud (mode clair / sombre) */
    canvas.yvSetPalette = function (name) { if (link(name) && reduced) frame(start); };

    var mx = .5, my = .5, tmx = .5, tmy = .5;
    var section = canvas.closest('section');
    if (section) {
      section.addEventListener('mousemove', function (e) {
        var r = section.getBoundingClientRect();
        tmx = (e.clientX - r.left) / r.width;
        tmy = 1 - (e.clientY - r.top) / r.height;
      }, { passive: true });
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      var w = Math.max(1, Math.round(r.width * dpr));
      var hgt = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== hgt) {
        canvas.width = w; canvas.height = hgt;
        gl.viewport(0, 0, w, hgt);
      }
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    var start = performance.now();
    var visible = true, raf = 0;
    function frame(now) {
      raf = 0;
      mx += (tmx - mx) * .04;
      my += (tmy - my) * .04;
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, reduced ? 40 : (now - start) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    }
    /* pause quand le fond n'est pas visible (économie de batterie) */
    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      }).observe(canvas);
    }
    if (reduced) { frame(start); } else { raf = requestAnimationFrame(frame); }
  }

  document.querySelectorAll('[data-shader]').forEach(init);
})();
