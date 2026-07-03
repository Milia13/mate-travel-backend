const fs = require('fs');

function fixEncoding(text) {
    return text
        .replace(/A\x83A\xAD/g, 'í')
        .replace(/A\x83A\x81/g, 'Á')
        .replace(/A\x83A\x89/g, 'É')
        .replace(/A\x83A\x8D/g, 'Í')
        .replace(/A\x83A\x93/g, 'Ó')
        .replace(/A\x83A\x9A/g, 'Ú')
        .replace(/A\x83A\x91/g, 'Ñ')
        .replace(/Ã¡/g, 'á')
        .replace(/Ã©/g, 'é')
        .replace(/Ã­/g, 'í')
        .replace(/Ã³/g, 'ó')
        .replace(/Ãº/g, 'ú')
        .replace(/Ã±/g, 'ñ')
        .replace(/A/g, 'á') // Fallback for weird characters
        .replace(/A/g, 'ó')
        .replace(/A/g, 'é')
        .replace(/A/g, 'í')
        .replace(/A/g, 'ñ')
        .replace(/A/g, 'ú');
}

// 1. Fix inicio.html encoding
let inicioHtml = fs.readFileSync('pantallas/inicio.html', 'latin1'); // Read as latin1 to preserve bytes if corrupted
inicioHtml = Buffer.from(inicioHtml, 'latin1').toString('utf8'); // Try to decode properly

// If it's still containing Ã¡, replace manually
inicioHtml = fixEncoding(inicioHtml);

// 2. Apply the layout changes safely
// Replace main and add right sidebar
inicioHtml = inicioHtml.replace('<main class="col-lg-9 col-xl-10 p-4 p-md-5">', '<main class="col-lg-7 col-xl-7 p-4 p-md-5 border-end">');

const rightSidebarHTML = 
            </main>

            <!-- RIGHT SIDEBAR (Novedades y Widgets) -->
            <aside class="col-lg-2 col-xl-3 d-none d-lg-flex flex-column gap-4 p-4 p-xl-5 min-vh-100 bg-body-tertiary border-start">
                
                <!-- Progreso de Perfil -->
                <div class="card border-0 shadow-sm rounded-4 bg-body">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="fw-bold mb-0">Tu Perfil</h6>
                            <span class="badge bg-success bg-opacity-10 text-success rounded-pill fw-semibold">45%</span>
                        </div>
                        <div class="progress mb-3" style="height: 6px;">
                            <div class="progress-bar bg-success" role="progressbar" style="width: 45%;" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p class="text-body-secondary small mb-3 lh-sm">Completá tu biografía para obtener más visualizaciones y ganar <strong class="text-success">50 JeviaPuntos</strong>.</p>
                        <a href="perfil.html" class="btn btn-outline-success btn-sm w-100 rounded-pill fw-semibold">Completar ahora</a>
                    </div>
                </div>

                <!-- Destinos Populares -->
                <div class="card border-0 shadow-sm rounded-4 bg-body">
                    <div class="card-body p-4">
                        <h6 class="fw-bold mb-4">Destinos Populares 🔥</h6>
                        
                        <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light-subtle">
                            <div class="rounded-3 overflow-hidden shadow-sm" style="width: 50px; height: 50px; flex-shrink: 0;">
                                <img src="../images/mendoza.jpg" alt="Mendoza" class="w-100 h-100 object-fit-cover" onerror="this.src='https://images.unsplash.com/photo-1589808381504-2ee6fc11f5cc?w=150'">
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold fs-6">Mendoza</h6>
                                <span class="text-body-secondary small"><i class="bi bi-people-fill text-success me-1"></i> 120 viajeros</span>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-light-subtle">
                            <div class="rounded-3 overflow-hidden shadow-sm" style="width: 50px; height: 50px; flex-shrink: 0;">
                                <img src="../images/salta.jpg" alt="Salta" class="w-100 h-100 object-fit-cover" onerror="this.src='https://images.unsplash.com/photo-1629851602498-8e6f1f26a798?w=150'">
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold fs-6">Salta</h6>
                                <span class="text-body-secondary small"><i class="bi bi-people-fill text-success me-1"></i> 85 viajeros</span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-3 overflow-hidden shadow-sm" style="width: 50px; height: 50px; flex-shrink: 0;">
                                <img src="../images/bariloche.jpg" alt="Bariloche" class="w-100 h-100 object-fit-cover" onerror="this.src='https://images.unsplash.com/photo-1614742410319-e58f0ddb322a?w=150'">
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold fs-6">Bariloche</h6>
                                <span class="text-body-secondary small"><i class="bi bi-people-fill text-success me-1"></i> 60 viajeros</span>
                            </div>
                        </div>
                    </div>
                </div>

            </aside>
;

inicioHtml = inicioHtml.replace('</main>', rightSidebarHTML);

// Header replacements
inicioHtml = inicioHtml.replace('<div class="col-lg-7 col-xl-8 mb-3 mb-lg-0">', '<div class="col-lg-6 col-xl-7 mb-3 mb-lg-0">');
const searchHTML = '<div class="col-lg-5 col-xl-4">\r\n                              <div class="input-group';
const newSearchHTML = <div class="col-lg-6 col-xl-5 d-flex gap-3 justify-content-end align-items-center">
                              <div class="input-group flex-grow-1;
inicioHtml = inicioHtml.replace(searchHTML, newSearchHTML);

const notificationHTML = 
                              </div>
                              <!-- NOTIFICATIONS -->
                              <div class="dropdown">
                                  <button class="btn btn-light rounded-circle position-relative p-2 border-0 shadow-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                      <i class="bi bi-bell-fill text-success fs-5"></i>
                                      <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                                          <span class="visually-hidden">Nuevas notificaciones</span>
                                      </span>
                                  </button>
                                  <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 mt-2" style="width: 320px;">
                                      <li><h6 class="dropdown-header fw-bold text-body-emphasis fs-6">Notificaciones</h6></li>
                                      <li><hr class="dropdown-divider"></li>
                                      <li>
                                          <a class="dropdown-item d-flex gap-3 align-items-center py-2" href="#">
                                              <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style="width:40px; height:40px;"><i class="bi bi-eye-fill fs-5"></i></div>
                                              <div>
                                                  <p class="mb-0 small fw-semibold text-wrap lh-sm">Sofía vió tu perfil</p>
                                                  <span class="text-body-secondary" style="font-size: 0.75rem;">Hace 2 horas</span>
                                              </div>
                                          </a>
                                      </li>
                                      <li>
                                          <a class="dropdown-item d-flex gap-3 align-items-center py-2" href="#">
                                              <div class="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style="width:40px; height:40px;"><i class="bi bi-star-fill fs-5"></i></div>
                                              <div>
                                                  <p class="mb-0 small fw-semibold text-wrap lh-sm">A Martín le interesa tu viaje a Mendoza</p>
                                                  <span class="text-body-secondary" style="font-size: 0.75rem;">Hace 5 horas</span>
                                              </div>
                                          </a>
                                      </li>
                                      <li>
                                          <a class="dropdown-item d-flex gap-3 align-items-center py-2" href="#">
                                              <div class="bg-warning bg-opacity-10 text-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style="width:40px; height:40px;"><i class="bi bi-trophy-fill fs-5"></i></div>
                                              <div>
                                                  <p class="mb-0 small fw-semibold text-wrap lh-sm">¡Ganaste 50 JeviaPuntos!</p>
                                                  <span class="text-body-secondary" style="font-size: 0.75rem;">Ayer</span>
                                              </div>
                                          </a>
                                      </li>
                                      <li><hr class="dropdown-divider"></li>
                                      <li><a class="dropdown-item text-center small text-success fw-bold" href="#">Ver todas</a></li>
                                  </ul>
                              </div>
                          </div>;

inicioHtml = inicioHtml.replace('</div>\r\n                          </div>\r\n                      </div>\r\n                  </div>\r\n                  <!-- Quick Filters -->', notificationHTML + '\r\n                      </div>\r\n                  </div>\r\n                  <!-- Quick Filters -->');

// Also try with \n only
inicioHtml = inicioHtml.replace('</div>\n                          </div>\n                      </div>\n                  </div>\n                  <!-- Quick Filters -->', notificationHTML + '\n                      </div>\n                  </div>\n                  <!-- Quick Filters -->');

// Now, fix the images inside avatar wrappers by adding bootstrap classes so they don't break
inicioHtml = inicioHtml.replace(/<img src="([^"]+)" alt="([^"]*)">/g, '<img src="" alt="" class="w-100 h-100 object-fit-cover rounded-circle">');
// And add width to wrapper
inicioHtml = inicioHtml.replace(/companion-avatar-wrap/g, 'companion-avatar-wrap rounded-circle overflow-hidden shadow-sm" style="width: 80px; height: 80px;');


fs.writeFileSync('pantallas/inicio.html', inicioHtml, 'utf8');

// 3. Update styles.css with necessary missing classes just in case
let stylesCss = fs.readFileSync('styles.css', 'utf8');
const missingCSS = 
/* Restored essential avatar CSS */
.companion-avatar-wrap { width: 80px; height: 80px; border-radius: 50%; overflow: hidden; }
.companion-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
.modal-avatar-frame { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; margin: -60px auto 0; border: 4px solid #fff; background: #fff; position: relative; z-index: 2; shadow: 0 .5rem 1rem rgba(0,0,0,.15); }
.modal-avatar-frame img { width: 100%; height: 100%; object-fit: cover; }
.companion-card-banner { height: 100px; background: linear-gradient(135deg, var(--bs-success) 0%, var(--bs-primary) 100%); opacity: 0.8; }
;
if (!stylesCss.includes('companion-avatar-wrap')) {
    fs.writeFileSync('styles.css', stylesCss + missingCSS, 'utf8');
}

console.log("Done");