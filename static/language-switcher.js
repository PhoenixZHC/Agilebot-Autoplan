// 语言切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言
    const currentLang = getCurrentLanguage();
    applyLanguage(currentLang);
    
    // 语言切换按钮事件
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    
    if (languageBtn && languageDropdown) {
        // 点击按钮显示/隐藏下拉菜单
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        // 点击语言选项
        languageDropdown.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                console.log('切换语言到:', lang);
                if (window.setLanguage) {
                    window.setLanguage(lang);
                } else {
                    // 如果setLanguage不存在，直接调用applyLanguage
                    if (window.applyLanguage) {
                        window.applyLanguage(lang);
                    }
                    if (window.getCurrentLanguage) {
                        localStorage.setItem('language', lang);
                    }
                }
                languageDropdown.classList.remove('show');
            });
        });
        
        // 点击页面其他地方关闭下拉菜单
        document.addEventListener('click', function(e) {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });
    }
    
    // 更新select选项的翻译
    function updateSelectOptions() {
        document.querySelectorAll('select[data-i18n-options]').forEach(select => {
            const optionsKey = select.getAttribute('data-i18n-options');
            const options = optionsKey.split(',');
            const currentLang = translations[getCurrentLanguage()] || translations['zh'];
            
            options.forEach((optionKey, index) => {
                const option = select.options[index];
                if (option && currentLang[optionKey.trim()]) {
                    option.textContent = currentLang[optionKey.trim()];
                }
            });
        });
    }
    
    // 更新手动规划预览（如果当前正在显示）
    function updateManualPlanningPreview() {
        const manualPreviewElement = document.querySelector('.manual-planning-preview');
        if (manualPreviewElement && manualPreviewElement.style.display !== 'none') {
            // 尝试从存储的数据属性中获取完整数据
            const storedData = manualPreviewElement._recipeData;
            if (storedData && window.showManualPlanningPreview) {
                // 使用存储的数据重新显示，这样会使用新的语言
                // 增加延迟确保翻译函数已经更新
                setTimeout(function() {
                    window.showManualPlanningPreview(storedData);
                }, 150);
            }
        }
    }
    
    // 更新P点数据表格中的坐标系方向（如果表格正在显示）
    // 将函数暴露到window对象，以便在语言切换时可以调用
    window.updatePDataTableCoordinates = function updatePDataTableCoordinates() {
        const tableContainer = document.getElementById('p_data_table_container');
        if (!tableContainer || tableContainer.style.display !== 'block') {
            return; // 表格未显示，不需要更新
        }
        
        const tableBody = document.querySelector('#p_data_table tbody');
        if (tableBody) {
            const rows = tableBody.querySelectorAll('tr');
            rows.forEach(row => {
                const coordCell = row.cells[7];
                if (coordCell) {
                    // 优先使用data属性中的原始值（最可靠的方法）
                    const leftRightValueAttr = coordCell.getAttribute('data-left-right-value');
                    if (leftRightValueAttr !== null) {
                        const leftRightValue = parseInt(leftRightValueAttr, 10);
                        // 注意：arm_left_right 的值为 1 表示右手坐标系，0 或其他值表示左手坐标系
                        const leftRightText = leftRightValue === 1 ? t('left_right_right') : t('left_right_left');
                        // 确保翻译文本有效
                        const safeLeftRightText = (leftRightText && leftRightText !== 'left_right_right' && leftRightText !== 'left_right_left' && leftRightText !== 'undefined')
                            ? leftRightText
                            : (leftRightValue === 1 ? '右手坐标系' : '左手坐标系');
                        coordCell.textContent = safeLeftRightText;
                    } else if (tableBody._pDataTableData) {
                        // 如果没有data属性，尝试从存储的原始数据中获取
                        const rowIndex = Array.from(rows).indexOf(row);
                        if (tableBody._pDataTableData[rowIndex]) {
                            const pose = tableBody._pDataTableData[rowIndex];
                            const leftRightValue = pose.poseData.cartData.baseCart.posture.arm_left_right;
                            const leftRightText = leftRightValue === 1 ? t('left_right_right') : t('left_right_left');
                            const safeLeftRightText = (leftRightText && leftRightText !== 'left_right_right' && leftRightText !== 'left_right_left' && leftRightText !== 'undefined')
                                ? leftRightText
                                : (leftRightValue === 1 ? '右手坐标系' : '左手坐标系');
                            coordCell.textContent = safeLeftRightText;
                            // 同时设置data属性，方便下次使用
                            coordCell.setAttribute('data-left-right-value', leftRightValue);
                        }
                    } else {
                        // 如果都没有，尝试从当前文本推断
                        const currentText = coordCell.textContent.trim();
                        // 检查当前文本是右手还是左手（支持多种语言）
                        const isRightHanded = currentText === '右手' || currentText === '右手坐标系' || 
                                             currentText === 'Right-Handed' || 
                                             currentText === 'Hệ Tọa Độ Tay Phải';
                        const isLeftHanded = currentText === '左手' || currentText === '左手坐标系' || 
                                            currentText === 'Left-Handed' || 
                                            currentText === 'Hệ Tọa Độ Tay Trái';
                        
                        if (isRightHanded) {
                            const rightText = t('left_right_right');
                            coordCell.textContent = (rightText && rightText !== 'left_right_right' && rightText !== 'undefined')
                                ? rightText
                                : '右手坐标系';
                            coordCell.setAttribute('data-left-right-value', '1');
                        } else if (isLeftHanded) {
                            const leftText = t('left_right_left');
                            coordCell.textContent = (leftText && leftText !== 'left_right_left' && leftText !== 'undefined')
                                ? leftText
                                : '左手坐标系';
                            coordCell.setAttribute('data-left-right-value', '0');
                        }
                    }
                }
            });
        }
    }
    
    // 重写applyLanguage函数以包含select选项更新
    const originalApplyLanguage = window.applyLanguage;
    window.applyLanguage = function(lang) {
        if (originalApplyLanguage) {
            originalApplyLanguage(lang);
        }
        updateSelectOptions();
        // 延迟更新手动规划预览和P点数据表格，确保翻译已加载
        setTimeout(function() {
            updateManualPlanningPreview();
            updatePDataTableCoordinates();
        }, 200);
    };
    
    // 更新连接按钮文本（在语言切换后调用）
    function updateConnectButtonAfterLanguageChange() {
        const connectButton = document.getElementById('robot_connect_button');
        if (connectButton) {
            // 优先检查robot_status是否显示来判断连接状态，这样更可靠
            const robotStatus = document.getElementById('robot_status');
            const isActuallyConnected = robotStatus && robotStatus.style.display !== 'none';
            
            // 如果无法从状态判断，再检查按钮文本
            if (!isActuallyConnected) {
                const currentText = connectButton.textContent.trim();
                const isDisconnected = currentText === t('connect') || currentText === '连接' || currentText === 'Connect' || currentText === 'Kết Nối';
                const isConnected = currentText === t('disconnect') || currentText === '断开连接' || currentText === 'Disconnect' || currentText === 'Ngắt Kết Nối';
                
                if (isConnected) {
                    connectButton.textContent = t('disconnect');
                    return;
                }
            }
            
            // 根据实际连接状态更新按钮文本
            if (isActuallyConnected) {
                connectButton.textContent = t('disconnect');
            } else {
                connectButton.textContent = t('connect');
            }
        }
    }
    
    // 修复按钮样式（防止按钮在语言切换后变成长条）
    function fixButtonStyles() {
        // 修复连接按钮
        const connectButton = document.getElementById('robot_connect_button');
        if (connectButton) {
            // 先保存当前文本内容
            const currentText = connectButton.textContent;
            
            // 强制设置固定宽度，与CSS样式保持一致
            connectButton.style.setProperty('width', '60px', 'important');
            connectButton.style.setProperty('flex-shrink', '0', 'important');
            connectButton.style.setProperty('flex-grow', '0', 'important');
            connectButton.style.setProperty('min-width', '60px', 'important');
            connectButton.style.setProperty('max-width', '60px', 'important');
            
            // 确保文本不会消失
            if (currentText && currentText.trim()) {
                connectButton.textContent = currentText;
            }
            
            // 触发重排
            void connectButton.offsetWidth;
            
            // 在多个时机确保按钮宽度固定和文本不消失
            // 使用setTimeout确保在所有DOM更新后再次设置
            setTimeout(function() {
                connectButton.style.setProperty('width', '60px', 'important');
                connectButton.style.setProperty('min-width', '60px', 'important');
                connectButton.style.setProperty('max-width', '60px', 'important');
                
                // 再次确保文本存在
                if (!connectButton.textContent.trim() && currentText && currentText.trim()) {
                    connectButton.textContent = currentText;
                }
            }, 50);
        }
        
        // 修复读取P点按钮
        const readPDataButton = document.getElementById('read_p_data_button');
        if (readPDataButton) {
            readPDataButton.style.setProperty('width', 'max-content', 'important');
            readPDataButton.style.setProperty('flex-shrink', '0', 'important');
            readPDataButton.style.setProperty('flex-grow', '0', 'important');
            readPDataButton.style.setProperty('min-width', 'auto', 'important');
            readPDataButton.style.setProperty('max-width', 'none', 'important');
            void readPDataButton.offsetWidth;
        }
    }
    
    // 更新配方列表中的手动规划标签
    function updateRecipeListLabels() {
        const recipeListItems = document.querySelectorAll('#recipe-list li');
        recipeListItems.forEach(li => {
            const recipeNameSpan = li.querySelector('.recipe-name');
            if (recipeNameSpan) {
                const text = recipeNameSpan.textContent;
                // 检查是否包含手动规划标签（可能是任何语言的）
                const match = text.match(/^(.+?)\((.+?)\)$/);
                if (match) {
                    const recipeName = match[1];
                    // 重新获取配方信息以判断类型
                    fetch('/get_recipe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ recipeName: recipeName }),
                    })
                    .then(response => response.json())
                    .then(recipeData => {
                        if (recipeData.isManualPlanning === true) {
                            recipeNameSpan.textContent = `${recipeName}(${t('menu_manual_planning')})`;
                        } else {
                            recipeNameSpan.textContent = recipeName;
                        }
                    })
                    .catch(error => {
                        console.error('更新配方标签失败:', error);
                    });
                }
            }
        });
    }
    
    // 更新配方预览标题
    function updateRecipePreviewTitle() {
        const previewTitle = document.querySelector('.recipe-preview h2');
        if (previewTitle) {
            const text = previewTitle.textContent;
            // 检查是否包含配方预览标题
            const match = text.match(/^(.+?)\s*-\s*(.+?)(\((.+?)\))?$/);
            if (match) {
                const recipeName = match[2];
                const isManualPlanning = match[4] !== undefined;
                if (isManualPlanning) {
                    previewTitle.textContent = `${t('recipe_preview')} - ${recipeName}(${t('menu_manual_planning')})`;
                } else {
                    previewTitle.textContent = `${t('recipe_preview')} - ${recipeName}`;
                }
            }
        }
    }
    
    // 重写setLanguage函数，在语言切换后更新连接按钮和修复样式
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        // 在语言切换前，先保存连接按钮的状态和文本
        const connectButton = document.getElementById('robot_connect_button');
        const robotStatus = document.getElementById('robot_status');
        const isActuallyConnected = robotStatus && robotStatus.style.display !== 'none';
        const savedButtonText = connectButton ? connectButton.textContent : '';
        
        if (originalSetLanguage) {
            originalSetLanguage(lang);
        }
        
        // 使用requestAnimationFrame确保在DOM更新后执行
        requestAnimationFrame(function() {
            // 先修复按钮样式，确保宽度固定
            fixButtonStyles();
            
            // 立即更新连接按钮文本，避免闪烁
            if (connectButton) {
                if (isActuallyConnected) {
                    connectButton.textContent = t('disconnect');
                } else {
                    connectButton.textContent = t('connect');
                }
            }
            
            // 更新配方列表和预览标题
            updateRecipeListLabels();
            updateRecipePreviewTitle();
            
            // 更新P点数据表格中的坐标系方向
            updatePDataTableCoordinates();
            
            // 使用双重requestAnimationFrame确保样式修复在布局更新后执行
            requestAnimationFrame(function() {
                fixButtonStyles();
                
                // 最后再次确保按钮状态正确
                if (connectButton) {
                    connectButton.style.setProperty('width', '60px', 'important');
                    connectButton.style.setProperty('min-width', '60px', 'important');
                    connectButton.style.setProperty('max-width', '60px', 'important');
                    
                    // 确保按钮文本不会为空
                    if (!connectButton.textContent.trim()) {
                        connectButton.textContent = isActuallyConnected ? t('disconnect') : t('connect');
                    }
                }
                
                // 再次更新P点数据表格，确保在DOM完全更新后执行
                updatePDataTableCoordinates();
            });
        });
    };
});
