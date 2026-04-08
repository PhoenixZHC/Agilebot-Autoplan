// 判断当前环境是否运行在插件中，选择不同的提示框
const isExtension = gbtExtension.isInExtension();
// 是否处在TP中，两种情况，1. 插件环境 2. 直接访问此插件的端口
const isTP = window.isTP;

// TP插件环境中，alert无法使用
const alertSuccess =
  !isExtension
    ? alert
    : gbtExtension.rtmNotification.success;
const alertError =
  !isExtension
    ? alert
    : gbtExtension.rtmNotification.error;
const alertInfo =
  !isExtension
    ? alert
    : gbtExtension.rtmNotification.info;
// TP插件环境中，confirm无法使用
const myConfirm = function(message) {
    if (!isExtension) {
        return confirm(message);
    }
    return new Promise((resolve) => {
        gbtExtension.rtmMessageBox.confirm(message).then(() => {
            resolve(true);
        }).catch(() => {
            resolve(false);
        });
    });
}

// 页面加载时初始化菜单栏
document.addEventListener('DOMContentLoaded', function () {
    // 默认显示机器人设置
    showSection('robot-settings-content');
    document.getElementById('robot-settings-btn').classList.add('active');

    // 初始化菜单栏状态
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    // 点击菜单按钮时展开菜单
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.addEventListener('click', function() {
            sidebar.classList.add('expanded');
        });
    });

    // 点击内容区域时缩回菜单
    content.addEventListener('click', function() {
        sidebar.classList.remove('expanded');
    });

    // 初始化 shape_type 输入框显示状态
    const shapeType = document.getElementById('shape_type').value;
    updateInputFields(shapeType);



    // 初始化底边长输入框的显示状态
    const triangleType = document.getElementById('triangle_type').value;
    const baseLengthInput = document.getElementById('triangle_base_length_input');
    if (triangleType === 'isosceles') {
        baseLengthInput.style.display = 'block'; // 显示底边长输入框
    } else {
        baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
    }

    loadRecipeList(); // 初始加载所有配方
    
    // 重置配方预览状态，确保智能规划预览元素可见
    resetRecipePreview();
    
    // 设置默认配方类型为智能规划
    window.currentRecipeType = 'smart';

    const recipeListItems = document.querySelectorAll("#recipe-list li");

    recipeListItems.forEach((li) => {
        const textNodes = Array.from(li.childNodes).filter(
            (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ""
        );

        if (textNodes.length > 0) {
            const recipeName = textNodes[0].textContent.trim();
            const span = document.createElement("span");
            span.className = "recipe-name";
            span.textContent = recipeName;
            li.insertBefore(span, li.firstChild); // 将包裹后的配方名插入到最前面
        }
    });

    // 监听工具布局选项的变化
    document.getElementById('tool_layout').addEventListener('change', function () {
        const toolLayout = this.value;
        const toolCountInput = document.getElementById('tool_count');

        if (toolLayout === 'double') {
            toolCountInput.value = 2; // 双向布局时，工具数量固定为2
            toolCountInput.disabled = true; // 禁用工具数量输入框
        } else {
            toolCountInput.disabled = false; // 单侧布局时，启用工具数量输入框
        }
    });

    // 添加配方号输入框的事件监听器
    const recipeNumberInput = document.getElementById('recipe-number');
    if (recipeNumberInput) {
        recipeNumberInput.addEventListener('input', updateExternalCallVisibility);
    }

    // 添加调用信号DI输入框的事件监听器
    const callSignalInput = document.getElementById('call-signal');
    if (callSignalInput) {
        callSignalInput.addEventListener('input', updateExternalCallVisibility);
    }

    // 添加完成信号DO输入框的事件监听器
    const finishSignalInput = document.getElementById('finish-signal');
    if (finishSignalInput) {
        finishSignalInput.addEventListener('input', updateExternalCallVisibility);
    }

    // 初始化显示状态
    updateExternalCallVisibility();

    // 添加外部调用选择框的事件监听器
    const externalCallSelect = document.getElementById('external-call');
    if (externalCallSelect) {
        externalCallSelect.addEventListener('change', handleExternalCallChange);
    }

    // 页面卸载时清理监控
    window.addEventListener('beforeunload', function() {
        stopExternalCallMonitor();
    });

    // 在示教器环境中自动获取机器人IP并连接
    if (isExtension) {
        gbtExtension.enableShortcut();
        autoConnectRobot();
    }

    // 添加配方操作按钮事件监听器
    setupRecipeOperationListeners();
});

// 自动连接机器人函数
function autoConnectRobot() {
    console.log('检测到示教器环境，开始自动获取机器人IP...');

    // 获取机器人IP地址
    fetch('/get_robot_ip', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.robot_ip) {
            console.log('自动获取到机器人IP:', data.robot_ip);

            // 将IP地址填入输入框
            document.getElementById('robot_ip').value = data.robot_ip;

            // 自动点击连接按钮
            console.log('自动连接机器人...');
            document.getElementById('robot_connect_button').click();
        } else {
            console.log('无法自动获取机器人IP，需要手动输入:', data.message);
        }
    })
    .catch(error => {
        console.error('自动获取机器人IP失败:', error);
    });
}

// 处理外部调用选择框变化
function handleExternalCallChange() {
    const externalCallValue = document.getElementById('external-call').value;
    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    const finishSignal = document.getElementById('finish-signal').value;

    if (externalCallValue === '1' && recipeNumber && callSignal && finishSignal) {
        // 开启外部调用监控
        startExternalCallMonitor();
    } else {
        // 停止外部调用监控
        stopExternalCallMonitor();
    }
}

// 外部调用监控相关变量
let externalCallInterval = null;
let isMonitoring = false;
let lastTriggerTime = 0; // 记录上次触发时间
let isAutoWriting = false; // 记录是否正在自动写入
const TRIGGER_COOLDOWN = 3000; // 3秒冷却时间

// 开始外部调用监控
function startExternalCallMonitor() {
    if (isMonitoring) {
        return; // 已经在监控中
    }

    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    const finishSignal = document.getElementById('finish-signal').value;

    if (!recipeNumber || !callSignal || !finishSignal) {
        alertError(t('error_input_required'));
        return;
    }

    isMonitoring = true;
    console.log('开始外部调用监控...');
    updateStatusDisplay(t('monitoring_status_monitoring', { signal: callSignal }), 'monitoring');

    // 每0.3秒检查一次DI信号
    externalCallInterval = setInterval(() => {
        checkExternalCall();
    }, 300);
}

// 停止外部调用监控
function stopExternalCallMonitor() {
    if (externalCallInterval) {
        clearInterval(externalCallInterval);
        externalCallInterval = null;
    }
    isMonitoring = false;
    isAutoWriting = false; // 重置写入状态
    console.log('停止外部调用监控');
    updateStatusDisplay(t('monitoring_status_stopped_text'));
}

// 检查外部调用
function checkExternalCall() {
    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    const finishSignal = document.getElementById('finish-signal').value;

    // 如果正在自动写入，则跳过此次检查
    if (isAutoWriting) {
        console.log('正在自动写入中，跳过此次配方调用检查');
        updateStatusDisplay(t('monitoring_status_processing'), 'processing');
        return;
    }

    fetch('/start_external_call_monitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mh_number: recipeNumber,
            di_number: callSignal,
            do_number: finishSignal
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('外部调用监控错误:', data.error);
            updateStatusDisplay(t('error_monitoring_failed', { error: data.error }), 'error');
            stopExternalCallMonitor();
            return;
        }

        // 打印DI信号状态
        console.log(`DI${callSignal} 信号状态: ${data.di_value}`);

        if (data.triggered) {
            // 再次检查是否正在自动写入（双重保险）
            if (isAutoWriting) {
                console.log('正在自动写入中，忽略此次触发');
                return;
            }

            // 检查是否在冷却时间内
            const currentTime = Date.now();
            if (currentTime - lastTriggerTime < TRIGGER_COOLDOWN) {
                console.log('触发信号在冷却时间内，忽略此次触发');
                return;
            }

            // 更新触发时间
            lastTriggerTime = currentTime;

            // DI信号为1，读取到MH值，加载对应配方
            console.log(`检测到触发信号，MH${recipeNumber} 寄存器值: ${data.mh_value}`);
            updateStatusDisplay(t('monitoring_status_triggered', { mh: data.mh_value }), 'triggered');

            // 加载配方但不停止监控
            loadRecipeByMHValue(data.mh_value);

            // 延迟一下再继续监控，避免重复触发
            setTimeout(() => {
                if (isMonitoring) {
                    updateStatusDisplay(t('monitoring_status_monitoring', { signal: callSignal }), 'monitoring');
                }
            }, 2000); // 2秒后恢复监控状态显示
        }
    })
    .catch(error => {
        console.error('外部调用监控请求失败:', error);
        updateStatusDisplay(t('error_monitoring_failed', { error: error.message }), 'error');
        stopExternalCallMonitor();
    });
}

// 根据MH值加载配方
function loadRecipeByMHValue(mhValue) {
    console.log('开始根据MH值加载配方，MH值:', mhValue);

    // 首先获取所有配方列表
    fetch('/get_recipe_list', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('获取配方列表失败:', data.error);
            updateStatusDisplay(`获取配方列表失败: ${data.error}`, 'error');
            return;
        }

        console.log('获取到的配方列表:', data.recipes);

        // 查找配方编号匹配的配方
        const targetRecipe = data.recipes.find(recipe => {
            console.log('检查配方:', recipe.recipeName, '配方编号:', recipe.recipeId, '目标MH值:', mhValue);
            return recipe.recipeId == mhValue; // 使用==进行类型转换比较
        });

        if (targetRecipe) {
            console.log('找到匹配的配方:', targetRecipe.recipeName, '配方编号:', targetRecipe.recipeId);

            // 检查是否开启自动写入
            const autoWriteValue = document.getElementById('auto-write').value;
            console.log('自动写入设置:', autoWriteValue);

            if (autoWriteValue === '1') {
                // 自动写入模式：先跳转到数据清单页面，然后执行自动写入
                console.log('执行自动写入模式，跳转到数据清单页面...');
                updateStatusDisplay(`找到配方: ${targetRecipe.recipeName}，跳转到数据清单页面...`, 'processing');

                // 跳转到数据清单页面
                showSection('data-list-content');
                setActiveButton('data-list-btn');

                // 然后执行自动写入
                performAutoWrite(targetRecipe.recipeName);
            } else {
                // 手动模式：加载到数据清单页面并显示配方数据
                console.log('执行手动模式，加载配方到数据清单页面');
                window.isFromExternalCall = true; // 设置标志位
                loadRecipeToPlanning(targetRecipe.recipeName);
                updateStatusDisplay(t('success_recipe_loaded') + targetRecipe.recipeName, 'success');
                alertSuccess(t('success_recipe_loaded') + targetRecipe.recipeName);
            }
        } else {
            console.log('未找到配方编号为', mhValue, '的配方');
            console.log('可用的配方编号:', data.recipes.map(r => r.recipeId));
            updateStatusDisplay(t('error_load_recipe_failed', { error: mhValue }), 'error');
            alertError(t('error_load_recipe_failed', { error: mhValue }));
        }
    })
    .catch(error => {
        console.error('根据MH值加载配方失败:', error);
        updateStatusDisplay(t('error_load_recipe_failed', { error: error.message }), 'error');
    });
}

// 全局变量，用于跟踪写入P点操作的状态
let isWriteOperationInProgress = false;
let writeOperationPromise = null;
let writeOperationCount = 0; // 跟踪需要完成的写入操作数量
let completedOperations = 0; // 已完成的写入操作数量
let writeOperationResults = []; // 存储所有写入操作的结果

// 执行自动写入功能
function performAutoWrite(recipeName) {
    console.log('开始执行自动写入功能，配方名称:', recipeName);

    // 设置正在自动写入标志
    isAutoWriting = true;
    updateStatusDisplay(`正在加载配方到数据清单页面...`, 'processing');

    // 重置写入操作计数器
    writeOperationCount = 0;
    completedOperations = 0;
    writeOperationResults = [];

    // 1. 首先加载配方到数据清单页面
    window.isFromExternalCall = true; // 设置标志位
    loadRecipeToPlanning(recipeName);

    // 2. 等待页面加载完成后，检查机器人状态
    setTimeout(() => {
        updateStatusDisplay(`正在检查机器人状态...`, 'processing');

        // 检查机器人状态
        fetch('/check_robot_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('检查机器人状态失败:', data.error);
                updateStatusDisplay(t('error_robot_status_check_failed') + data.error, 'error');
                alertError(t('error_robot_status_check_failed') + data.error);
                isAutoWriting = false; // 重置写入状态
                throw new Error(data.error);
            }

            console.log('机器人状态:', data.status, '是否空闲:', data.is_idle);

            if (!data.is_idle) {
                updateStatusDisplay(`机器人当前状态: ${data.status}，无法自动写入`, 'error');
                alertError(`机器人当前状态: ${data.status}，无法自动写入`);
                isAutoWriting = false; // 重置写入状态
                throw new Error(`机器人当前状态: ${data.status}，无法自动写入`);
            }

            // 3. 检查运行中的程序
            updateStatusDisplay(`机器人状态正常，检查运行中的程序...`, 'processing');
            return fetch('/check_running_programs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('检查运行程序失败:', data.error);
                updateStatusDisplay(t('error_check_running_program_failed') + data.error, 'error');
                alertError(t('error_check_running_program_failed') + data.error);
                isAutoWriting = false; // 重置写入状态
                throw new Error(data.error);
            }

            console.log('运行中的程序:', data.running_programs, '是否有程序运行:', data.has_running_programs);

            if (data.has_running_programs) {
                updateStatusDisplay(`当前有程序在运行: ${data.running_programs.join(', ')}，无法自动写入`, 'error');
                alertError(`当前有程序在运行: ${data.running_programs.join(', ')}，无法自动写入`);
                isAutoWriting = false; // 重置写入状态
                throw new Error(`当前有程序在运行: ${data.running_programs.join(', ')}，无法自动写入`);
            }

            // 4. 状态检查通过，开始写入P点操作
            updateStatusDisplay(`状态检查通过，开始自动写入P点...`, 'processing');

            // 确保程序名称输入框有值
            const programNameInput = document.getElementById('write_program_name');
            if (!programNameInput.value) {
                programNameInput.value = recipeName; // 使用配方名称作为程序名称
            }

            // 创建一个Promise来等待所有写入操作完成
            writeOperationPromise = new Promise((resolve, reject) => {
                // 设置写入操作完成后的回调
                // 注意：P点写入和R寄存器写入总是会执行，TF写入只有在自动TF功能开启时才会执行
                window.onWriteOperationComplete = (success, message, operationType) => {
                    console.log(`写入操作完成: ${operationType}, 成功: ${success}, 消息: ${message}`);

                    // 记录操作结果
                    writeOperationResults.push({
                        type: operationType,
                        success: success,
                        message: message
                    });

                    completedOperations++;

                    // 检查是否所有操作都完成了
                    if (completedOperations >= writeOperationCount) {
                        // 检查是否有失败的操作
                        const failedOperations = writeOperationResults.filter(op => !op.success);

                        if (failedOperations.length > 0) {
                            // 有失败的操作
                            const errorMessages = failedOperations.map(op => `${op.type}: ${op.message}`).join('; ');
                            reject(new Error(errorMessages));
                        } else {
                            // 所有操作都成功
                            const successMessages = writeOperationResults.map(op => `${op.type}: ${op.message}`).join('; ');
                            resolve(successMessages);
                        }
                    }
                };

                // 模拟点击写入P点按钮
                console.log('模拟点击写入P点按钮');
                document.getElementById('write_p_data_button').click();
            });

            // 等待写入操作完成
            return writeOperationPromise;
        })
        .then((message) => {
            console.log('自动写入完成:', message);
            updateStatusDisplay(t('monitoring_status_auto_write_complete'), 'success');
            alertSuccess(t('success_recipe_auto_write', { name: recipeName }));
            isAutoWriting = false; // 重置写入状态

            // 自动写入完成后，触发DO信号
            triggerFinishSignal();
        })
        .catch(error => {
            console.error('自动写入过程出错:', error);
            updateStatusDisplay(t('monitoring_status_auto_write_failed') + error.message, 'error');
            alertError(t('error_auto_write_failed') + error.message);
            isAutoWriting = false; // 重置写入状态
        });
    }, 1000); // 等待1秒，确保页面加载完成
}

// 菜单栏按钮点击事件
document.getElementById('robot-settings-btn').addEventListener('click', function () {
    showSection('robot-settings-content');
    setActiveButton('robot-settings-btn');
});

document.getElementById('smart-planning-btn').addEventListener('click', function () {
    showSection('smart-planning-content');
    setActiveButton('smart-planning-btn');
});

document.getElementById('data-list-btn').addEventListener('click', function () {
    showSection('data-list-content');
    setActiveButton('data-list-btn');
});

document.getElementById('interval-calculator-btn').addEventListener('click', function () {
    showSection('interval-calculator-content');
    setActiveButton('interval-calculator-btn');
});

// 显示对应的内容区域
function showSection(sectionId) {
    // 隐藏所有内容区域
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });

    // 显示选中的内容区域
    document.getElementById(sectionId).style.display = 'block';
    
    // 重新应用当前语言,确保新显示的内容区域中的元素文字正确
    if (typeof getCurrentLanguage === 'function' && typeof applyLanguage === 'function') {
        const currentLang = getCurrentLanguage();
        applyLanguage(currentLang);
    }
    
    // 如果切换到配方库，重置预览状态
    if (sectionId === 'recipe-library-content') {
        resetRecipePreview();
    }
}

// 设置当前选中的菜单按钮
function setActiveButton(buttonId) {
    // 移除所有按钮的 active 类
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.classList.remove('active');
    });

    // 为选中的按钮添加 active 类
    document.getElementById(buttonId).classList.add('active');
}

// 动态显示或隐藏底边长输入框
document.getElementById('triangle_type').addEventListener('change', function () {
    const triangleType = this.value;
    const baseLengthInput = document.getElementById('triangle_base_length_input');

    if (triangleType === 'isosceles') {
        baseLengthInput.style.display = 'block'; // 显示底边长输入框
    } else {
        baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
    }
});



// 动态显示图形输入框
document.getElementById('shape_type').addEventListener('change', function () {
    const shapeType = this.value;
    updateInputFields(shapeType);
});

function updateInputFields(shapeType) {
    // 隐藏所有形状特定的输入字段
    document.getElementById('circle_input').style.display = 'none';
    document.getElementById('rectangle_input').style.display = 'none';
    document.getElementById('polygon_input').style.display = 'none';
    document.getElementById('triangle_input').style.display = 'none';
    document.getElementById('polygon_arrangement_input').style.display = 'none';

    // 显示所选形状的输入字段
    if (shapeType === 'circle') {
        document.getElementById('circle_input').style.display = 'block';
    } else if (shapeType === 'rectangle') {
        document.getElementById('rectangle_input').style.display = 'block';
    } else if (shapeType === 'polygon') {
        document.getElementById('polygon_input').style.display = 'block';
        // 检查当前边数
        const sides = parseInt(document.getElementById('polygon_sides').value);
        if (sides === 6) {
            document.getElementById('polygon_arrangement_input').style.display = 'block';
        }
    } else if (shapeType === 'triangle') {
        document.getElementById('triangle_input').style.display = 'block';
    }
}

// 添加多边形边数变化的事件监听器
document.getElementById('polygon_sides').addEventListener('change', function() {
    const sides = parseInt(this.value);
    if (sides === 6) {
        document.getElementById('polygon_arrangement_input').style.display = 'block';
    } else {
        document.getElementById('polygon_arrangement_input').style.display = 'none';
    }
});

let shapeCenters = [];  // 全局变量，用于存储图形的中心位置
// 在全局变量中存储行数和列数
let rows = 0;
let cols = 0;

// 获取表单数据并发送请求
document.getElementById('inputForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // 获取参数设置表单的数据
    const frame_length = document.getElementById('frame_length').value;
    const frame_width = document.getElementById('frame_width').value;
    const frame_depth = document.getElementById('frame_depth').value;
    const shape_type = document.getElementById('shape_type').value;
    const shape_height = document.getElementById('shape_height').value;

    let shape_length, shape_width, polygon_sides, triangle_type, triangle_orientation, polygon_arrangement;

    if (shape_type === 'circle') {
        shape_length = document.getElementById('circle_diameter').value;
        shape_width = shape_length;
    } else if (shape_type === 'rectangle') {
        shape_length = document.getElementById('rectangle_length').value;
        shape_width = document.getElementById('rectangle_width').value;
    } else if (shape_type === 'polygon') {
        polygon_sides = document.getElementById('polygon_sides').value;
        shape_length = document.getElementById('polygon_side_length').value;
        shape_width = shape_length;
        // 获取多边形排布方式
        polygon_arrangement = document.getElementById('polygon_arrangement').value;
    } else if (shape_type === 'triangle') {
        triangle_type = document.getElementById('triangle_type').value;
        shape_length = document.getElementById('triangle_side_length').value;
        triangle_orientation = document.getElementById('triangle_orientation').value;

        // 如果是等腰三角形，传递底边长；否则传递边长作为底边长
        if (triangle_type === 'isosceles') {
            shape_width = document.getElementById('triangle_base_length').value;
        } else {
            shape_width = shape_length; // 等边三角形的底边长等于边长
        }
    }

    // 获取摆放设置表单的数据
    const horizontal_spacing = document.getElementById('horizontal_spacing').value;
    const vertical_spacing = document.getElementById('vertical_spacing').value;
    const horizontal_border_distance = document.getElementById('horizontal_border_distance').value;
    const vertical_border_distance = document.getElementById('vertical_border_distance').value;
    const material_thickness = document.getElementById('material_thickness').value;
    const placement_layers = document.getElementById('placement_layers').value;
    const layout_type = document.getElementById('layout_type').value;
    const place_type = document.getElementById('place_type').value;
    const remainder_turn = document.getElementById('remainder_turn').value;

    // 发送请求到后端
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            frame_length,
            frame_width,
            frame_depth,
            shape_length,
            shape_width,
            horizontal_spacing,
            vertical_spacing,
            horizontal_border_distance,
            vertical_border_distance,
            material_thickness,
            placement_layers,
            shape_type,
            layout_type,
            polygon_sides,
            triangle_type,
            triangle_orientation,
            shape_height,
            place_type,
            remainder_turn,
            polygon_arrangement  // 添加多边形排布方式参数
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '请求失败');
            });
        }
        // 获取填充的图形数量和中心位置数据
        const totalShapes = response.headers.get('X-Total-Shapes');
        const shapeCentersData = response.headers.get('X-Shape-Centers');
        const shapesPerRowOrCol = response.headers.get('X-Shapes-Per-Row-Or-Col');  // 获取单行/列填充数量
        const rowColInfo = JSON.parse(response.headers.get('X-Row-Col-Info'));  // 获取行号和列号信息
        rows = response.headers.get('X-Rows');  // 获取行数
        cols = response.headers.get('X-Cols');  // 获取列数
        shapeCenters = JSON.parse(shapeCentersData);  // 将中心位置数据存储到全局变量中
        rowColInfoGlobal = rowColInfo;  // 将行号和列号信息存储到全局变量中

        // 如果是三角形，将 totalShapes 除以 2
        const adjustedTotalShapes = shape_type === 'triangle' ? Math.floor(totalShapes / 2) : totalShapes;

        // 显示填充的图形数量
        document.getElementById('shape-count').style.display = 'block';
        document.getElementById('shape-count-value').textContent = adjustedTotalShapes;
        document.getElementById('shapes-per-row-or-col').style.display = 'block';
        document.getElementById('shapes-per-row-or-col-value').textContent = shapesPerRowOrCol;

        // 返回图像数据
        return response.blob();
    })
    .then(blob => {
        // 创建图像URL
        const imageUrl = URL.createObjectURL(blob);
        const plotImage = document.getElementById('plot');
        if (!plotImage) {
            console.error('plot element not found');
            return;
        }
        plotImage.src = imageUrl;
        plotImage.style.display = 'block';

        // 将 blob 转换为 Base64 字符串
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    plotImage.setAttribute('data-base64', reader.result);
                    console.log('Base64 data set successfully:', reader.result.substring(0, 50) + '...');
                } else {
                    console.error('Failed to convert image to base64');
                }
                resolve();
            };
            reader.onerror = (error) => {
                console.error('Error converting image to base64:', error);
                reject(error);
            };
            reader.readAsDataURL(blob);
        });
    })
    .then(() => {
        // 获取PR寄存器ID
        const pr_register_id = document.getElementById('pr_register_id').value;

        // 读取PR寄存器的C值
        return fetch('/read_pr_register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pr_register_id: pr_register_id
            }),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('读取PR寄存器失败');
        }
        return response.json();
    })
    .then(data => {
        const cValue = parseFloat(data.c); // 获取PR寄存器的C值并转换为浮点数
        console.log('从后端读取的C值:', cValue); // 打印C值

        // 填充数据清单表格
        const tableBody = document.querySelector('#data-list-content table tbody');
        tableBody.innerHTML = ''; // 清空表格内容

        // 遍历所有图形中心位置，填充到表格中
        shapeCenters.forEach((center, index) => {
            const row = document.createElement('tr');

            // 行号
            const cell1 = document.createElement('td');
            cell1.textContent = rowColInfoGlobal[index][0]; // 行号
            cell1.style.border = '1px solid #ddd';
            cell1.style.padding = '8px';
            row.appendChild(cell1);

            // 列号
            const cell2 = document.createElement('td');
            cell2.textContent = rowColInfoGlobal[index][1]; // 列号
            cell2.style.border = '1px solid #ddd';
            cell2.style.padding = '8px';
            row.appendChild(cell2);

            // P_ID
            const cell3 = document.createElement('td');
            cell3.textContent = index + 1; // P_ID从1开始
            cell3.style.border = '1px solid #ddd';
            cell3.style.padding = '8px';
            row.appendChild(cell3);

            // X坐标
            const cell4 = document.createElement('td');
            cell4.textContent = center[0].toFixed(2); // X坐标
            cell4.style.border = '1px solid #ddd';
            cell4.style.padding = '8px';
            row.appendChild(cell4);

            // X补偿（初始为0）
            const cell5 = document.createElement('td');
            cell5.textContent = '0.00';
            cell5.style.border = '1px solid #ddd';
            cell5.style.padding = '8px';
            row.appendChild(cell5);

            // Y坐标
            const cell6 = document.createElement('td');
            cell6.textContent = center[1].toFixed(2); // Y坐标
            cell6.style.border = '1px solid #ddd';
            cell6.style.padding = '8px';
            row.appendChild(cell6);

            // Y补偿（初始为0）
            const cell7 = document.createElement('td');
            cell7.textContent = '0.00';
            cell7.style.border = '1px solid #ddd';
            cell7.style.padding = '8px';
            row.appendChild(cell7);

            // C坐标（使用从PR寄存器读取的C值）
            const cell8 = document.createElement('td');
            cell8.textContent = isNaN(cValue) ? '0.00' : cValue.toFixed(2); // 使用读取到的C值，如果无效则显示0.00
            cell8.style.border = '1px solid #ddd';
            cell8.style.padding = '8px';
            row.appendChild(cell8);

            // C补偿（初始为0）
            const cell9 = document.createElement('td');
            cell9.textContent = '0.00';
            cell9.style.border = '1px solid #ddd';
            cell9.style.padding = '8px';
            row.appendChild(cell9);

            tableBody.appendChild(row);
        });

        // 跳转到数据清单页面
        showSection('data-list-content');
        setActiveButton('data-list-btn');
    })
    .catch(error => {
        alertError(error.message);
    });
});

// 绘制图形
function drawShapes(shape_centers, shape_type, frame_length, frame_width) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置画布尺寸与边框尺寸一致
    const scale_factor = 4; // 放大4倍
    canvas.width = frame_length * scale_factor;
    canvas.height = frame_width * scale_factor;

    // 绘制边框
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, frame_length * scale_factor, frame_width * scale_factor);

    shape_centers.forEach(center => {
        const [x, y] = center;
        if (shape_type === 'circle') {
            ctx.beginPath();
            ctx.arc(x * scale_factor, y * scale_factor, 5 * scale_factor / 2, 0, 2 * Math.PI); // 半径为5，放大4倍
            ctx.fillStyle = 'blue';
            ctx.fill();
        } else if (shape_type === 'rectangle') {
            ctx.fillStyle = 'green';
            ctx.fillRect(
                x * scale_factor - 5 * scale_factor / 2,
                y * scale_factor - 5 * scale_factor / 2,
                10 * scale_factor / 2,
                10 * scale_factor / 2
            ); // 10x10 的矩形，放大4倍
        } else if (shape_type === 'polygon') {
            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.moveTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor);
            ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor);
            ctx.lineTo(x * scale_factor - 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor + 2.5 * scale_factor / 2, y * scale_factor - 5 * scale_factor / 2);
            ctx.closePath();
            ctx.fill();
        } else if (shape_type === 'triangle') {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(x * scale_factor, y * scale_factor - 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor - 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.lineTo(x * scale_factor + 5 * scale_factor / 2, y * scale_factor + 5 * scale_factor / 2);
            ctx.closePath();
            ctx.fill();
        }
    });
}

// 处理机器人连接和断开连接
function fetchWithTimeout(url, options, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('请求超时')), timeout)
        )
    ]);
}

// 在机器人连接成功后显示程序输入框
document.getElementById('robot_connect_button').addEventListener('click', function () {
    const robotIp = document.getElementById('robot_ip').value;
    const connectButton = document.getElementById('robot_connect_button');
    const isConnected = connectButton.textContent === t('disconnect') || connectButton.textContent === '断开连接';

    if (isConnected) {
        // 如果当前是"断开连接"状态，则发送断开连接请求
        fetchWithTimeout('/disconnect_robot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        }, 5000) // 设置超时时间为 5 秒
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || '断开连接失败');
                });
            }
            return response.json();
        })
        .then(data => {
            // 更新按钮状态和显示
            connectButton.setAttribute('data-i18n', 'connect');
            connectButton.textContent = t('connect');
            document.getElementById('robot_status').style.display = 'none';
            document.getElementById('program_input').style.display = 'none'; // 隐藏程序输入框
            document.getElementById('p_data_table_container').style.display = 'none'; // 隐藏P点数据表格
            console.log('机器人已断开连接');
            
            // 确保按钮文本正确显示
            if (window.applyLanguage && window.getCurrentLanguage) {
                setTimeout(() => {
                    window.applyLanguage(window.getCurrentLanguage());
                }, 10);
            }
        })
        .catch(error => {
            console.error('断开连接失败:', error.message);
            alertError(t('error_disconnect_failed') + error.message);
        });
    } else {
        // 如果当前是"连接"状态，则发送连接请求
        if (!robotIp) {
            alertError('请输入机器人IP地址');
            return;
        }

        fetchWithTimeout('/connect_robot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                robot_ip: robotIp
            }),
        }, 5000) // 设置超时时间为 5 秒
        .then(response => {
            if (!response.ok) {
            // 连接失败时，重置按钮状态
            connectButton.textContent = t('connect');
                return response.json().then(err => {
                    throw new Error(err.error || '连接失败');
                });
            }
            return response.json();
        })
        .then(data => {
            // 更新按钮状态和显示
            connectButton.setAttribute('data-i18n', 'disconnect');
            connectButton.textContent = t('disconnect');
            const robotStatus = document.getElementById('robot_status');
            const robotIpDisplay = document.getElementById('robot_ip_display');
            const robotModel = document.getElementById('robot_model');
            const controllerVersion = document.getElementById('controller_version');

            robotIpDisplay.textContent = robotIp;
            robotModel.textContent = data.model_info;
            controllerVersion.textContent = data.controller_version; // 显示控制柜版本
            robotStatus.style.display = 'block';
            document.getElementById('program_input').style.display = 'block'; // 显示程序输入框

            console.log('机器人连接成功');
            
            // 确保按钮文本正确显示
            if (window.applyLanguage && window.getCurrentLanguage) {
                setTimeout(() => {
                    window.applyLanguage(window.getCurrentLanguage());
                }, 10);
            }
        })
        .catch(error => {
            console.error('连接失败:', error.message);
            // 连接失败时，先重置按钮状态
            connectButton.setAttribute('data-i18n', 'connect');
            connectButton.textContent = t('connect');
            
            // 确保按钮文本正确显示
            if (window.applyLanguage && window.getCurrentLanguage) {
                setTimeout(() => {
                    window.applyLanguage(window.getCurrentLanguage());
                }, 10);
            }
            
            // 然后根据错误类型显示不同的提示
            if (error.message === '请求超时' || error.message.includes('timeout')) {
                alertError(t('error_timeout'));
            } else {
                alertError(t('error_connect_failed') + error.message);
            }
        });
    }
});

// 处理读取P点数据的按钮点击事件
document.getElementById('read_p_data_button').addEventListener('click', function () {
    const programName = document.getElementById('program_name').value || 'PUT';
    // 如果用户没有输入，则使用默认值 'PUT'

    if (!programName) {
        alertError('请输入程序名称');
        return;
    }

    // 发送请求到后端获取P点数据
    fetch('/get_p_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            program_name: programName
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '获取P点数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        // 显示P点数据表格
        const tableContainer = document.getElementById('p_data_table_container');
        const tableBody = document.querySelector('#p_data_table tbody');
        tableBody.innerHTML = ''; // 清空之前的表格数据

        // 存储原始数据以便语言切换时使用
        tableBody._pDataTableData = data.poses;
        
        // 填充表格数据
        data.poses.forEach((pose, index) => {
            const row = document.createElement('tr');

            // 序号
            const cell1 = document.createElement('td');
            cell1.textContent = index + 1;
            cell1.style.border = '1px solid #ddd';
            cell1.style.padding = '8px';
            row.appendChild(cell1);

            // X坐标
            const cell2 = document.createElement('td');
            cell2.textContent = pose.poseData.cartData.baseCart.position.x.toFixed(2);
            cell2.style.border = '1px solid #ddd';
            cell2.style.padding = '8px';
            row.appendChild(cell2);

            // Y坐标
            const cell3 = document.createElement('td');
            cell3.textContent = pose.poseData.cartData.baseCart.position.y.toFixed(2);
            cell3.style.border = '1px solid #ddd';
            cell3.style.padding = '8px';
            row.appendChild(cell3);

            // Z坐标
            const cell4 = document.createElement('td');
            cell4.textContent = pose.poseData.cartData.baseCart.position.z.toFixed(2);
            cell4.style.border = '1px solid #ddd';
            cell4.style.padding = '8px';
            row.appendChild(cell4);

            // C坐标
            const cell5 = document.createElement('td');
            cell5.textContent = pose.poseData.cartData.baseCart.position.c.toFixed(2);
            cell5.style.border = '1px solid #ddd';
            cell5.style.padding = '8px';
            row.appendChild(cell5);

            // UF值
            const cell6 = document.createElement('td');
            cell6.textContent = pose.poseData.cartData.uf; // 直接显示UF值
            cell6.style.border = '1px solid #ddd';
            cell6.style.padding = '8px';
            row.appendChild(cell6);

            // TF值
            const cell7 = document.createElement('td');
            cell7.textContent = pose.poseData.cartData.tf; // 直接显示TF值
            cell7.style.border = '1px solid #ddd';
            cell7.style.padding = '8px';
            row.appendChild(cell7);

            // 坐标系方向值
            const cell8 = document.createElement('td');
            const leftRightValue = pose.poseData.cartData.baseCart.posture.arm_left_right;
            // 存储原始值到data属性，方便语言切换时更新
            cell8.setAttribute('data-left-right-value', leftRightValue);
            
            // 获取当前语言并使用对应的翻译
            // 注意：arm_left_right 的值为 1 表示右手坐标系，0 或其他值表示左手坐标系
            const currentLang = getCurrentLanguage();
            let leftRightText;
            if (leftRightValue === 1) {
                // 右手坐标系
                if (currentLang === 'zh') {
                    leftRightText = '右手坐标系';
                } else if (currentLang === 'en') {
                    leftRightText = 'Right-Handed';
                } else if (currentLang === 'vi') {
                    leftRightText = 'Hệ Tọa Độ Tay Phải';
                } else if (currentLang === 'ko') {
                    leftRightText = '오른손 좌표계';
                } else {
                    leftRightText = '右手坐标系'; // 默认中文
                }
            } else {
                // 左手坐标系
                if (currentLang === 'zh') {
                    leftRightText = '左手坐标系';
                } else if (currentLang === 'en') {
                    leftRightText = 'Left-Handed';
                } else if (currentLang === 'vi') {
                    leftRightText = 'Hệ Tọa Độ Tay Trái';
                } else if (currentLang === 'ko') {
                    leftRightText = '왼손 좌표계';
                } else {
                    leftRightText = '左手坐标系'; // 默认中文
                }
            }
            
            cell8.textContent = leftRightText;
            cell8.style.border = '1px solid #ddd';
            cell8.style.padding = '8px';
            row.appendChild(cell8);

            tableBody.appendChild(row);
        });

        // 显示表格
        tableContainer.style.display = 'block';
    })
    .catch(error => {
        console.error('获取P点数据失败:', error.message);
        alertError('获取P点数据失败: ' + error.message);
    });
});

// 处理写入P点数据的按钮点击事件
document.getElementById('write_p_data_button').addEventListener('click', function () {
    const programName = document.getElementById('write_program_name').value || 'PUT'; // 如果用户没有输入，则使用默认值 'PUT'
    const startPPoint = parseInt(document.getElementById('start_p_point').value, 10);
    const prRegisterId = parseInt(document.getElementById('pr_register_id').value, 10); // 将PR寄存器ID转换为整数
    const ufValue = parseInt(document.getElementById('uf_value').value, 10); // 将UF值转换为整数
    const toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
    const left_right = parseInt(document.getElementById('left_right').value, 10); // 获取工具数量

    if (!programName) {
        alertError('请输入程序名称');
        return;
    }

    if (isNaN(prRegisterId)) { // 检查PR寄存器ID是否为有效数字
        alertError('请输入有效的PR寄存器ID');
        return;
    }
    if (isNaN(startPPoint) || startPPoint < 1) {
        alertError(t('error_invalid_start_p_point'));
        return;
    }

    // 获取数据清单表格中的数据
    const tableBody = document.querySelector('#data-list-content table tbody');
    const rows = tableBody.querySelectorAll('tr');

    if (rows.length === 0) {
        alertError('没有可用的数据');
        return;
    }

    // 如果是自动写入模式，增加操作计数器
    if (isAutoWriting) {
        writeOperationCount++;
        console.log(`增加P点写入操作计数器，当前总数: ${writeOperationCount}`);
    }

    // 准备要写入的P点数据
    const pData = [];
    rows.forEach((row, index) => {
        const pId = startPPoint + index; // 以起始P点为基准连续写入
        const x = parseFloat(row.cells[3].textContent); // X坐标
        const xCompensation = parseFloat(row.cells[4].textContent); // X补偿
        const y = parseFloat(row.cells[5].textContent); // Y坐标
        const yCompensation = parseFloat(row.cells[6].textContent); // Y补偿
        const c = parseFloat(row.cells[7].textContent); // C坐标
        const cCompensation = parseFloat(row.cells[8].textContent); // C补偿

        // 将XYC与对应的补偿值相加
        const finalX = x + xCompensation;
        const finalY = y + yCompensation;
        const finalC = c + cCompensation;

        pData.push({
            id: pId,
            x: finalX,
            y: finalY,
            z: 0, // 暂时设置为0，稍后从PR寄存器中读取Z值并更新
            c: finalC,
            uf: ufValue,
            tf: (index % toolCount) + 1, // 根据工具数量循环设置TF值
            left_right: left_right
        });
    });

    // 发送请求到后端读取PR寄存器的Z和C值
    fetch('/read_pr_register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pr_register_id: prRegisterId // 传递整数类型的PR寄存器ID
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '读取PR寄存器失败');
            });
        }
        return response.json();
    })
    .then(data => {
        const zValue = data.z; // 获取PR寄存器的Z值

        // 更新pData中的Z值
        pData.forEach(p => {
            p.z = zValue;
        });

        // 发送请求到后端写入P点数据
        return fetch('/write_p_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                program_name: programName,
                p_data: pData
            }),
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '写入P点数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('P点数据写入成功');
        alertSuccess('P点数据写入成功');

        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(true, 'P点数据写入成功', 'P点写入');
        }
    })
    .catch(error => {
        console.error('写入P点数据失败:', error.message);
        alertError('写入P点数据失败: ' + error.message);

        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(false, '写入P点数据失败: ' + error.message, 'P点写入');
        }
    });
});

// 在"写入P点"按钮点击事件中，新增R逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
    // 如果是自动写入模式，增加操作计数器
    if (isAutoWriting) {
        writeOperationCount++;
        console.log(`增加R寄存器写入操作计数器，当前总数: ${writeOperationCount}`);
    }

    // 检查当前配方类型
    const currentRecipeType = window.currentRecipeType || 'smart'; // 默认为智能规划
    
    if (currentRecipeType === 'manual') {
        // 手动规划配方：只写入三个基本参数
        const tableBody = document.querySelector('#data-list-content table tbody');
        const rows = tableBody.querySelectorAll('tr');
        const totalPoints = rows.length; // 点位总数
        
        // 从手动规划信息中获取行数和列数
        let rowCount = 0;
        let colCount = 0;
        let calculationMethod = 'row_priority';
        
        // 尝试从手动规划输入框获取行数和列数
        const rowCountInput = document.getElementById('row_count');
        const colCountInput = document.getElementById('col_count');
        const calculationMethodInput = document.getElementById('calculation_method');
        
        if (rowCountInput && colCountInput) {
            rowCount = parseInt(rowCountInput.value) || 0;  // 行数
            colCount = parseInt(colCountInput.value) || 0;  // 列数
        }
        
        if (calculationMethodInput) {
            calculationMethod = calculationMethodInput.value || 'row_priority';
        }
        
        // 获取工具数量（从机器人设置页面）
        const toolCount = document.getElementById('tool_count').value || 1;
        
        // 计算单行列数量
        // 行优先：单行列数量 = 列数
        // 列优先：单行列数量 = 行数
        const singleRowOrColCount = calculationMethod === 'row_priority' ? colCount : rowCount;
        
        // 发送请求到后端写入R寄存器（手动规划模式）
        fetch('/write_r_registers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipe_type: 'manual',
                total_points: totalPoints,        // R4寄存器：点位总数
                row_count: rowCount,              // R11寄存器：行数
                col_count: colCount,              // R12寄存器：列数
                tool_count: toolCount,            // R5寄存器：工具数量
                single_row_or_col_count: singleRowOrColCount  // R10寄存器：单行列数量
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || '写入R寄存器失败');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('手动规划R寄存器写入成功');
            alertSuccess('手动规划R寄存器写入成功');

            // 如果有自动写入的回调函数，调用它
            if (window.onWriteOperationComplete) {
                window.onWriteOperationComplete(true, '手动规划R寄存器写入成功', 'R寄存器写入');
            }
        })
        .catch(error => {
            console.error('手动规划R寄存器写入失败:', error.message);
            alertError('手动规划R寄存器写入失败: ' + error.message);

            // 如果有自动写入的回调函数，调用它
            if (window.onWriteOperationComplete) {
                window.onWriteOperationComplete(false, '手动规划R寄存器写入失败: ' + error.message, 'R寄存器写入');
            }
        });
        
        return; // 手动规划配方处理完毕，直接返回
    }
    
    // 智能规划配方：写入所有参数
    const frame_length = document.getElementById('frame_length').value;
    const frame_width = document.getElementById('frame_width').value;
    const frameDepth = document.getElementById('frame_depth').value;
    const shapeHeight = document.getElementById('shape_height').value;
    const materialThickness = document.getElementById('material_thickness').value;
    const placementLayers = document.getElementById('placement_layers').value;
    const shapeCountValue = document.getElementById('shape-count-value').textContent;
    const toolCount = document.getElementById('tool_count').value;
    const drop_Count = document.getElementById('drop_Count').value;
    const shapesPerRowOrColValue = document.getElementById('shapes-per-row-or-col-value').textContent;

    // 检查填充数量和工具数量是否有效
    if (!shapeCountValue || !toolCount) {
        alertError('请先进行计算并确保工具数量已选择');
        return;
    }

    // 发送请求到后端写入R寄存器（智能规划模式）
    fetch('/write_r_registers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recipe_type: 'smart',
            frame_length: frame_length,
            frame_width: frame_width,
            frame_depth: frameDepth,
            shape_height: shapeHeight,
            material_thickness: materialThickness,
            placement_layers: placementLayers,
            total_shapes: shapeCountValue, // 填充数量
            tool_count: toolCount,         // 工具数量
            drop_Count: drop_Count,
            numofsingle_row_or_col_value: shapesPerRowOrColValue,
            rows: rows,  // 行数
            cols: cols   // 列数
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '写入R寄存器失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('智能规划R寄存器写入成功');
        alertSuccess('智能规划R寄存器写入成功');

        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(true, '智能规划R寄存器写入成功', 'R寄存器写入');
        }
    })
    .catch(error => {
        console.error('智能规划R寄存器写入失败:', error.message);
        alertError('智能规划R寄存器写入失败: ' + error.message);

        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(false, '智能规划R寄存器写入失败: ' + error.message, 'R寄存器写入');
        }
    });
});

// 在"写入P点"按钮点击事件中，新增tf逻辑
document.getElementById('write_p_data_button').addEventListener('click', function () {
    const toolCount = parseInt(document.getElementById('tool_count').value, 10); // 获取工具数量
    const toolSpacing = parseFloat(document.getElementById('tool_spacing').value); // 获取工具间距
    const autoTF = parseInt(document.getElementById('auto_tf').value, 10); // 获取自动TF功能开关状态
    const toolLayout = document.getElementById('tool_layout').value; // 获取工具布局选项
    const toolDirection = document.getElementById('tool_direction').value;

    // 如果是自动写入模式且自动TF功能开启，增加操作计数器
    if (isAutoWriting && autoTF === 1) {
        writeOperationCount++;
        console.log(`增加TF写入操作计数器，当前总数: ${writeOperationCount}`);
    }

    if (isNaN(toolSpacing)) { // 检查工具间距是否为有效数字
        alertError('请输入有效的工具间距');
        return;
    }

    // 如果工具数量为 1，直接返回，不需要修改 TF
    if (toolCount === 1) {
        return;
    }

    // 如果自动TF功能关闭，直接返回，不调整TF
    if (autoTF === 0) {
        return;
    }

    // 发送请求到后端读取TF1的值
    fetch('/get_tf_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            tf_id: 1 // 读取TF1的值
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '读取TF1数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        const tf1 = data.tf; // 获取TF1的值

        // 复制TF1的值给其他TF，并根据工具布局和方向调整坐标值
        const tfUpdates = [];
        if (toolLayout === 'double') {
            // 双向布局时，工具数量只能为2
            if (toolCount !== 2) {
                alertError('双向布局时，工具数量必须为2');
                return;
            }

            // 计算TF1和TF2的偏移值
            const offset = toolSpacing / 2;

            // TF1的偏移值为正
            const tf1Update = {
                coordinate_info: {
                    coordinate_id: 1,
                    name: tf1.coordinate_info.name,
                    group_id: tf1.coordinate_info.group_id
                },
                position: {
                    x: toolDirection === 'x' ? offset : tf1.position.x,
                    y: toolDirection === 'y' ? offset : tf1.position.y,
                    z: tf1.position.z
                },
                orientation: {
                    r: tf1.orientation.r,
                    p: tf1.orientation.p,
                    y: tf1.orientation.y
                }
            };
            tfUpdates.push(tf1Update);

            // TF2的偏移值为负
            const tf2Update = {
                coordinate_info: {
                    coordinate_id: 2,
                    name: tf1.coordinate_info.name,
                    group_id: tf1.coordinate_info.group_id
                },
                position: {
                    x: toolDirection === 'x' ? -offset : tf1.position.x,
                    y: toolDirection === 'y' ? -offset : tf1.position.y,
                    z: tf1.position.z
                },
                orientation: {
                    r: tf1.orientation.r,
                    p: tf1.orientation.p,
                    y: tf1.orientation.y
                }
            };
            tfUpdates.push(tf2Update);
        } else {
            // 单侧布局时，根据工具方向调整坐标值
            for (let i = 2; i <= toolCount; i++) {
                const newTf = {
                    coordinate_info: {
                        coordinate_id: i,
                        name: tf1.coordinate_info.name,
                        group_id: tf1.coordinate_info.group_id
                    },
                    position: {
                        x: toolDirection === 'x' ? tf1.position.x + (i - 1) * toolSpacing : tf1.position.x,
                        y: toolDirection === 'y' ? tf1.position.y + (i - 1) * toolSpacing : tf1.position.y,
                        z: tf1.position.z
                    },
                    orientation: {
                        r: tf1.orientation.r,
                        p: tf1.orientation.p,
                        y: tf1.orientation.y
                    }
                };
                tfUpdates.push(newTf);
            }
        }

        // 调试输出，检查 tfUpdates 的内容
        console.log('tfUpdates:', tfUpdates);

        // 发送请求到后端更新TF
        return fetch('/update_tf_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tf_updates: tfUpdates
            }),
        });
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '更新TF数据失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('TF数据更新成功');
        alertSuccess('TF数据更新成功');

        // 如果有自动写入的回调函数且自动TF功能开启，调用它
        if (window.onWriteOperationComplete && autoTF === 1) {
            window.onWriteOperationComplete(true, 'TF数据更新成功', 'TF写入');
        }
    })
    .catch(error => {
        console.error('更新TF数据失败:', error.message);
        alertError('更新TF数据失败: ' + error.message);

        // 如果有自动写入的回调函数且自动TF功能开启，调用它
        if (window.onWriteOperationComplete && autoTF === 1) {
            window.onWriteOperationComplete(false, '更新TF数据失败: ' + error.message, 'TF写入');
        }
    });
});

// 新的手动规划功能
// 读取参考点按钮事件
document.getElementById('read_reference_points').addEventListener('click', function () {
    const rowCount = parseInt(document.getElementById('row_count').value, 10);
    const colCount = parseInt(document.getElementById('col_count').value, 10);
    const pr1Id = parseInt(document.getElementById('manual_pr1_id').value, 10);
    const pr2Id = parseInt(document.getElementById('manual_pr2_id').value, 10);
    const pr3Id = parseInt(document.getElementById('manual_pr3_id').value, 10);

    if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
        alertError('请输入有效的行数和列数（必须大于0）');
        return;
    }
    if ([pr1Id, pr2Id, pr3Id].some(id => isNaN(id) || id < 1)) {
        alertError(t('error_invalid_manual_pr_id'));
        return;
    }

    // 显示计算状态
    document.getElementById('calculation-status').style.display = 'block';
    document.getElementById('status-text').textContent = '正在读取参考点...';

    // 根据输入的PR ID读取参考点
    Promise.all([
        readPRRegister(pr1Id),
        readPRRegister(pr2Id),
        readPRRegister(pr3Id)
    ])
    .then(([pr1, pr2, pr3]) => {
        // 显示参考点坐标
        document.getElementById('pr1-x').textContent = pr1.x.toFixed(2);
        document.getElementById('pr1-y').textContent = pr1.y.toFixed(2);
        document.getElementById('pr1-z').textContent = pr1.z.toFixed(2);
        document.getElementById('pr1-c').textContent = pr1.c.toFixed(2);
        
        document.getElementById('pr2-x').textContent = pr2.x.toFixed(2);
        document.getElementById('pr2-y').textContent = pr2.y.toFixed(2);
        document.getElementById('pr2-z').textContent = pr2.z.toFixed(2);
        document.getElementById('pr2-c').textContent = pr2.c.toFixed(2);
        
        document.getElementById('pr3-x').textContent = pr3.x.toFixed(2);
        document.getElementById('pr3-y').textContent = pr3.y.toFixed(2);
        document.getElementById('pr3-z').textContent = pr3.z.toFixed(2);
        document.getElementById('pr3-c').textContent = pr3.c.toFixed(2);

        // 显示参考点表格和计算按钮
        document.querySelector('.reference-points-section').style.display = 'block';
        document.getElementById('calculate_points').disabled = false;
        
        // 隐藏计算状态
        document.getElementById('calculation-status').style.display = 'none';
        
        // 存储参考点数据和PR ID供后续计算使用（行列数在计算时实时读取）
        window.referencePoints = { pr1, pr2, pr3, pr1Id, pr2Id, pr3Id };
        
        // alertSuccess('参考点读取成功！'); // 已禁用成功提示弹窗
    })
    .catch(error => {
        console.error('读取参考点失败:', error);
        alertError('读取参考点失败: ' + error.message);
        document.getElementById('calculation-status').style.display = 'none';
    });
});

// 计算所有点位按钮事件
document.getElementById('calculate_points').addEventListener('click', function () {
    if (!window.referencePoints) {
        alertError('请先读取参考点');
        return;
    }

    // 重新读取当前输入框中的行数和列数
    const currentRowCount = parseInt(document.getElementById('row_count').value, 10);
    const currentColCount = parseInt(document.getElementById('col_count').value, 10);
    
    // 验证输入值
    if (!currentRowCount || !currentColCount || currentRowCount < 1 || currentColCount < 1) {
        alertError('请输入有效的行数和列数');
        return;
    }
    
    // 清除智能规划界面的所有参数和图片，防止保存时误判为智能规划配方
    clearSmartPlanningInterface();
    
    // 设置当前配方类型为手动规划
    window.currentRecipeType = 'manual';
    
    const { pr1, pr2, pr3 } = window.referencePoints;
    
    // 显示计算状态
    document.getElementById('calculation-status').style.display = 'block';
    document.getElementById('status-text').textContent = '正在计算所有点位...';

    // 获取计算方式选择
    const calculationMethod = document.getElementById('calculation_method').value;
    
    // 计算所有点的坐标（使用当前输入框中的最新值）
    const allPoints = calculateAllPoints(pr1, pr2, pr3, currentRowCount, currentColCount, calculationMethod);
    
    // 手动规划优先使用参考点1的C值，避免误读默认PR1导致报错
    const cValue = Number.isFinite(pr1.c) ? pr1.c : 0;
    
    // 将计算结果填入数据清单表格
    fillDataListTable(allPoints, cValue);
    
    // 隐藏计算状态
    document.getElementById('calculation-status').style.display = 'none';
    
    // 切换到数据清单页面
    showSection('data-list-content');
    setActiveButton('data-list-btn');
    
    alertSuccess(`计算完成！共生成 ${allPoints.length} 个点位`);
});

// 读取PR寄存器的函数
function readPRRegister(prId) {
    return fetch('/read_pr_register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            pr_id: prId
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '读取PR寄存器失败');
            });
        }
        return response.json();
    })
    .then(data => {
        return {
            x: data.x,
            y: data.y,
            z: data.z,
            c: data.c
        };
    });
}

// 计算所有点位的函数
// rowCount代表行数（Y方向），colCount代表列数（X方向）
function calculateAllPoints(pr1, pr2, pr3, rowCount, colCount, calculationMethod = 'row_priority') {
    const points = [];
    
    // 计算行间距和列间距
    // rowCount是行数，所以用rowSpacing计算Y方向间距
    // colCount是列数，所以用colSpacing计算X方向间距
    const rowSpacing = (pr2.y - pr1.y) / (rowCount - 1);  // Y方向间距，使用行数
    const colSpacing = (pr3.x - pr1.x) / (colCount - 1);  // X方向间距，使用列数
    
    // 根据计算方式生成不同顺序的点位
    if (calculationMethod === 'row_priority') {
        // 行优先：先按行遍历，再按列遍历
        for (let row = 1; row <= rowCount; row++) {  // 行数使用rowCount
            for (let col = 1; col <= colCount; col++) {  // 列数使用colCount
                const x = pr1.x + (col - 1) * colSpacing;
                const y = pr1.y + (row - 1) * rowSpacing;
                const z = pr1.z; // Z值保持与PR1相同
                
                points.push({
                    row: row,
                    col: col,
                    x: x,
                    y: y,
                    z: z
                });
            }
        }
    } else if (calculationMethod === 'col_priority') {
        // 列优先：先按列遍历，再按行遍历
        for (let col = 1; col <= colCount; col++) {  // 列数使用colCount
            for (let row = 1; row <= rowCount; row++) {  // 行数使用rowCount
                const x = pr1.x + (col - 1) * colSpacing;
                const y = pr1.y + (row - 1) * rowSpacing;
                const z = pr1.z; // Z值保持与PR1相同
                
                points.push({
                    row: row,
                    col: col,
                    x: x,
                    y: y,
                    z: z
                });
            }
        }
    }
    
    return points;
}

// 填充数据清单表格的函数
function fillDataListTable(points, cValue) {
    const tableBody = document.querySelector('#data-list-content table tbody');
    tableBody.innerHTML = ''; // 清空现有数据
    
    points.forEach((point, index) => {
        const row = document.createElement('tr');
        
        // 行号
        const cell1 = document.createElement('td');
        cell1.textContent = point.row;
        cell1.style.border = '1px solid #ddd';
        cell1.style.padding = '8px';
        row.appendChild(cell1);
        
        // 列号
        const cell2 = document.createElement('td');
        cell2.textContent = point.col;
        cell2.style.border = '1px solid #ddd';
        cell2.style.padding = '8px';
        row.appendChild(cell2);
        
        // P_ID (点位编号)
        const cell3 = document.createElement('td');
        cell3.textContent = index + 1;
        cell3.style.border = '1px solid #ddd';
        cell3.style.padding = '8px';
        row.appendChild(cell3);
        
        // X值
        const cell4 = document.createElement('td');
        cell4.textContent = point.x.toFixed(2);
        cell4.style.border = '1px solid #ddd';
        cell4.style.padding = '8px';
        row.appendChild(cell4);
        
        // X补偿 (初始为0)
        const cell5 = document.createElement('td');
        cell5.textContent = '0.00';
        cell5.style.border = '1px solid #ddd';
        cell5.style.padding = '8px';
        row.appendChild(cell5);
        
        // Y值
        const cell6 = document.createElement('td');
        cell6.textContent = point.y.toFixed(2);
        cell6.style.border = '1px solid #ddd';
        cell6.style.padding = '8px';
        row.appendChild(cell6);
        
        // Y补偿 (初始为0)
        const cell7 = document.createElement('td');
        cell7.textContent = '0.00';
        cell7.style.border = '1px solid #ddd';
        cell7.style.padding = '8px';
        row.appendChild(cell7);
        
        // C值
        const cell8 = document.createElement('td');
        cell8.textContent = cValue.toFixed(2);
        cell8.style.border = '1px solid #ddd';
        cell8.style.padding = '8px';
        row.appendChild(cell8);
        
        // C补偿 (初始为0)
        const cell9 = document.createElement('td');
        cell9.textContent = '0.00';
        cell9.style.border = '1px solid #ddd';
        cell9.style.padding = '8px';
        row.appendChild(cell9);
        
        tableBody.appendChild(row);
    });
}

// 更新补偿值的事件处理
document.getElementById('update-compensation').addEventListener('click', function () {
    const compensationType = document.getElementById('compensation-type').value;
    const rowColNumber = parseInt(document.getElementById('row-col-number').value, 10);
    const compensationValue = parseFloat(document.getElementById('compensation-value').value);
    const angleCompensation = parseFloat(document.getElementById('angle-compensation').value);

    if (isNaN(rowColNumber) || isNaN(compensationValue) || isNaN(angleCompensation)) {
        alertError('请输入有效的行号/列号、补偿值和角度补偿值');
        return;
    }

    const tableBody = document.querySelector('#data-list-content table tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const rowNumber = parseInt(row.cells[0].textContent, 10);
        const colNumber = parseInt(row.cells[1].textContent, 10);

        if ((compensationType === 'row' && rowNumber === rowColNumber) ||
            (compensationType === 'col' && colNumber === rowColNumber)) {
            // 更新Y补偿值（行补偿）或X补偿值（列补偿）
            if (compensationType === 'row') {
                row.cells[6].textContent = compensationValue.toFixed(2); // Y补偿
            } else {
                row.cells[4].textContent = compensationValue.toFixed(2); // X补偿
            }

            // 更新C补偿值
            row.cells[8].textContent = angleCompensation.toFixed(2); // C补偿
        }
    });

    alertSuccess('补偿值更新成功');
});

document.getElementById('save_recipe_button').addEventListener('click', function () {
    const recipeName = document.getElementById('recipe_name').value;
    const recipeId = document.getElementById('recipe_id').value; // 获取配方编号

    if (!recipeName || !recipeId) {
        alertError('请输入配方名和配方编号');
        return;
    }

    // 检查是否为手动规划配方（没有预览图片）
    const plotImg = document.getElementById('plot');
    const isManualPlanning = !plotImg || !plotImg.getAttribute('data-base64');
    
    if (isManualPlanning) {
        // 手动规划配方：检查是否有数据清单数据
        const table = document.querySelector('#data-list-content table');
        const rows = table.getElementsByTagName('tr');
        if (rows.length <= 1) { // 只有表头，没有数据
            alertError('请先计算手动规划点位数据');
            return;
        }
        // 手动规划配方可以继续保存，不需要预览图片
    } else {
        // 智能规划配方：检查图片是否已经生成
        if (!plotImg || !plotImg.getAttribute('data-base64')) {
            alertError('请先生成规划结果图片');
            return;
        }
    }

    // 先检查是否存在重名的配方文件
    fetch('/check_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recipeName: recipeName,
            recipeId: recipeId // 将配方编号发送到后端
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '检查配方失败');
            });
        }
        return response.json();
    })
    .then(async data => {
        let finalRecipeName = recipeName;
        let finalRecipeId = recipeId;

        // 处理配方名冲突
        if (data.exists) {
            const result = await showNameConflictDialog(recipeName);
            if (result.cancelled) {
                return; // 用户取消保存
            }
        }

        // 处理配方ID冲突
        if (data.id_exists) {
            const result = await showIdConflictDialog(data);
            if (result.cancelled) {
                return; // 用户取消保存
            }
            
            if (result.useNewId) {
                finalRecipeId = result.newId;
                // 更新界面上的配方ID显示
                document.getElementById('recipe_id').value = finalRecipeId;
            }
        }

        // 继续保存配方的逻辑
        saveRecipeData(finalRecipeName, finalRecipeId);
    })
    .catch(error => {
        console.error('检查配方失败:', error.message);
        alertError('检查配方失败: ' + error.message);
    });
});

function saveRecipeData(recipeName, recipeId) {
    // 获取数据清单表格中的数据
    const tableData = [];
    const table = document.querySelector('#data-list-content table');
    const rows = table.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        tableData.push({
            rowNumber: cells[0].textContent,
            colNumber: cells[1].textContent,
            pId: cells[2].textContent,
            x: parseFloat(cells[3].textContent),
            xCompensation: parseFloat(cells[4].textContent),
            y: parseFloat(cells[5].textContent),
            yCompensation: parseFloat(cells[6].textContent),
            c: parseFloat(cells[7].textContent),
            cCompensation: parseFloat(cells[8].textContent)
        });
    }

    // 检查是否为手动规划配方（没有预览图片）
    const plotImg = document.getElementById('plot');
    const isManualPlanning = !plotImg || !plotImg.getAttribute('data-base64');
    
    if (isManualPlanning) {
        // 手动规划配方：只保存基本数据和表格数据
        const recipeData = {
            recipeName: recipeName,
            recipeId: recipeId,
            tableData: tableData,
            isManualPlanning: true, // 标记为手动规划配方
            // 手动规划配方的其他必要信息
            manualPlanningInfo: {
                rowCount: document.getElementById('row_count')?.value || 0,
                colCount: document.getElementById('col_count')?.value || 0,
                calculationMethod: document.getElementById('calculation_method')?.value || 'row_priority',
                referencePoints: window.referencePoints || {}
            }
        };
        
        // 发送请求到后端保存手动规划配方
        fetch('/save_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipeData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || '保存配方失败');
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('手动规划配方保存成功');
            if (data.id_reassigned) {
                document.getElementById('recipe_id').value = data.new_id;
                alertSuccess(data.message);
            } else {
                alertSuccess('手动规划配方保存成功');
            }
        })
        .catch(error => {
            console.error('保存手动规划配方失败:', error.message);
            alertError('保存手动规划配方失败: ' + error.message);
        });
        
        return; // 提前返回，不执行智能规划配方的保存逻辑
    }

    // 智能规划配方：获取所有表单数据
    const frameLength = document.getElementById('frame_length')?.value || 0;
    const frameWidth = document.getElementById('frame_width')?.value || 0;
    const frameDepth = document.getElementById('frame_depth')?.value || 0;
    const shapeHeight = document.getElementById('shape_height')?.value || 0;
    const materialThickness = document.getElementById('material_thickness')?.value || 0;
    const placementLayers = document.getElementById('placement_layers')?.value || 1;
    const toolCount = document.getElementById('tool_count')?.value || 1;
    const toolSpacing = document.getElementById('tool_spacing')?.value || 0;
    const toolLayout = document.getElementById('tool_layout')?.value || 'single';
    const autoTF = document.getElementById('auto_tf')?.value || 1;
    const leftRight = document.getElementById('left_right')?.value || 1;

    // 获取智能规划界面的所有参数
    const shapeType = document.getElementById('shape_type')?.value || 'circle';
    const shapeLength = document.getElementById('shape_length')?.value || 0;
    const shapeWidth = document.getElementById('shape_width')?.value || 0;
    const dropCount = document.getElementById('drop_Count').value || 0;
    const horizontalSpacing = document.getElementById('horizontal_spacing')?.value || 0;
    const verticalSpacing = document.getElementById('vertical_spacing')?.value || 0;
    const horizontalBorderDistance = document.getElementById('horizontal_border_distance')?.value || 0;
    const verticalBorderDistance = document.getElementById('vertical_border_distance')?.value || 0;
    const layoutType = document.getElementById('layout_type')?.value || 'array';
    const placeType = document.getElementById('place_type')?.value || 'row';
    const remainderTurn = document.getElementById('remainder_turn')?.value || 'off';
    const polygonArrangement = document.getElementById('polygon_arrangement')?.value || 'diagonal';  // 添加多边形排布方式参数

    // 获取预览结果图的Base64编码
    const plotImageBase64 = plotImg.getAttribute('data-base64'); // 使用存储的 Base64 数据
    console.log('Saving smart planning recipe with base64 data:', plotImageBase64.substring(0, 50) + '...');

    // 获取填充数量和单行/列数量
    const shapeCountValue = document.getElementById('shape-count-value')?.textContent || 0;
    const shapesPerRowOrColValue = document.getElementById('shapes-per-row-or-col-value')?.textContent || 0;

    // 将所有数据打包成一个对象
    const recipeData = {
        recipeName: recipeName,
        recipeId: recipeId, // 保存配方编号
        tableData: tableData,
        frameLength: frameLength,
        frameWidth: frameWidth,
        frameDepth: frameDepth,
        shapeHeight: shapeHeight,
        materialThickness: materialThickness,
        placementLayers: placementLayers,
        shapeType: shapeType,
        shapeLength: shapeLength,
        shapeWidth: shapeWidth,
        dropCount: dropCount,
        horizontalSpacing: horizontalSpacing,
        verticalSpacing: verticalSpacing,
        horizontalBorderDistance: horizontalBorderDistance,
        verticalBorderDistance: verticalBorderDistance,
        layoutType: layoutType,
        placeType: placeType,
        remainderTurn: remainderTurn,
        plotImageBase64: plotImageBase64, // 使用Base64编码的图片数据
        shapeCountValue: shapeCountValue,
        shapesPerRowOrColValue: shapesPerRowOrColValue,
        circleDiameter: document.getElementById('circle_diameter')?.value || 0,
        rectangleLength: document.getElementById('rectangle_length')?.value || 0,
        rectangleWidth: document.getElementById('rectangle_width')?.value || 0,
        polygonSides: document.getElementById('polygon_sides')?.value || 0,
        polygonSideLength: document.getElementById('polygon_side_length')?.value || 0,
        polygonArrangement: polygonArrangement,  // 添加多边形排布方式参数
        triangleType: document.getElementById('triangle_type')?.value || 'equilateral',
        triangleSideLength: document.getElementById('triangle_side_length')?.value || 0,
        triangleBaseLength: document.getElementById('triangle_base_length')?.value || 0,
        triangleOrientation: document.getElementById('triangle_orientation')?.value || 'up',
        isManualPlanning: false // 标记为智能规划配方
    };

    // 发送请求到后端保存配方
    fetch('/save_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '保存配方失败');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('配方保存成功');
        if (data.id_reassigned) {
            // 如果有ID重新分配，更新界面上的配方ID显示
            document.getElementById('recipe_id').value = data.new_id;
            alertSuccess(data.message);
        } else {
            alertSuccess('配方保存成功');
        }
    })
    .catch(error => {
        console.error('保存配方失败:', error.message);
        alertError('保存配方失败: ' + error.message);
    });
}

// 新增配方库按钮点击事件
document.getElementById('recipe-library-btn').addEventListener('click', function () {
    showSection('recipe-library-content');
    setActiveButton('recipe-library-btn');
    loadRecipeList(); // 加载配方列表
});

// 输入框内容变化时自动查找
document.getElementById('recipe-search').addEventListener('input', function () {
    const keyword = this.value;
    loadRecipeList(keyword); // 根据关键字加载配方列表
});

// 加载配方列表，支持关键字过滤
function loadRecipeList(keyword = '') {
    fetch('/get_recipe_list')
        .then(response => response.json())
        .then(data => {
            const recipeList = document.getElementById('recipe-list');
            recipeList.innerHTML = ''; // 清空列表

            // 过滤配方列表
            const filteredRecipes = data.recipes.filter(recipe =>
                recipe.recipeName.toLowerCase().includes(keyword.toLowerCase())
            );

            // 填充过滤后的配方列表
            filteredRecipes.forEach(recipe => {
                const li = document.createElement('li');

                // 创建勾选框（仅在插件环境中创建）
                let checkbox = null;
                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'recipe-checkbox';
                checkbox.value = recipe.recipeId;
                checkbox.id = `recipe-${recipe.recipeName}`;

                // 为每个配方复选框添加变更事件监听器
                checkbox.addEventListener('change', updateSelectAllState);

                // 创建 <span> 并设置配方编号和配方名
                const recipeIdSpan = document.createElement('span');
                recipeIdSpan.className = 'recipe-id'; // 添加类名
                recipeIdSpan.textContent = recipe.recipeId; // 设置配方编号

                const recipeNameSpan = document.createElement('span');
                recipeNameSpan.className = 'recipe-name'; // 添加类名
                
                // 获取配方详细信息来判断类型
                fetch('/get_recipe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ recipeName: recipe.recipeName }),
                })
                .then(response => response.json())
                .then(recipeData => {
                    // 检查是否为手动规划配方
                    if (recipeData.isManualPlanning === true) {
                        const manualPlanningText = t('menu_manual_planning');
                        // 确保翻译文本不是 undefined
                        if (manualPlanningText && manualPlanningText !== 'menu_manual_planning' && manualPlanningText !== 'undefined') {
                            recipeNameSpan.textContent = `${recipe.recipeName}(${manualPlanningText})`;
                        } else {
                            // 如果翻译失败，使用中文作为后备
                            recipeNameSpan.textContent = `${recipe.recipeName}(手动规划)`;
                        }
                    } else {
                        recipeNameSpan.textContent = recipe.recipeName;
                    }
                })
                .catch(error => {
                    console.error('获取配方详细信息失败:', error);
                    recipeNameSpan.textContent = recipe.recipeName; // 失败时显示原始名称
                });

                // 将勾选框和 <span> 添加到 <li> 中
                if (checkbox) {
                    li.appendChild(checkbox);
                }
                li.appendChild(recipeIdSpan);
                li.appendChild(recipeNameSpan);

                // 添加读取按钮
                const readButton = document.createElement('button');
                readButton.className = 'recipe-read-btn';
                // 使用data-i18n属性确保语言切换时能正确更新
                readButton.setAttribute('data-i18n', 'read_recipe');
                // 直接使用t()函数获取翻译，如果翻译不存在则使用key作为默认值
                readButton.textContent = t('read_recipe');
                readButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    loadRecipeToPlanning(recipe.recipeName);
                });

                // 添加删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.className = 'recipe-delete-btn';
                // 使用data-i18n属性确保语言切换时能正确更新
                deleteButton.setAttribute('data-i18n', 'delete_recipe');
                // 直接使用t()函数获取翻译，如果翻译不存在则使用key作为默认值
                deleteButton.textContent = t('delete_recipe');
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    deleteRecipe(recipe.recipeName);
                });

                // 将按钮添加到 <li> 中
                li.appendChild(readButton);
                li.appendChild(deleteButton);

                // 将 <li> 添加到 <ul> 中
                recipeList.appendChild(li);

                // 绑定点击事件到 <li>，点击配方名时触发预览
                li.addEventListener('click', (e) => {
                    // 如果点击的是勾选框，不触发预览（仅在插件环境中显示勾选框）
                    if (isTP && e.target.type === 'checkbox') {
                        return;
                    }
                    // 获取干净的配方名称（移除可能存在的括号内容）
                    const recipeNameSpan = li.querySelector('.recipe-name');
                    const fullText = recipeNameSpan ? recipeNameSpan.textContent : recipe.recipeName;
                    const cleanRecipeName = fullText.split('(')[0].trim();
                    previewRecipe(cleanRecipeName);
                });
            });
            
            // 确保按钮文本正确显示
            if (window.applyLanguage && window.getCurrentLanguage) {
                setTimeout(() => {
                    window.applyLanguage(window.getCurrentLanguage());
                }, 10);
            }
        })
        .catch(error => console.error('加载配方列表失败:', error));
}

// 将图形类型的英文转换为当前语言
function getShapeTypeText(shapeType) {
    switch (shapeType) {
        case 'circle':
            return t('workpiece_type_circle');
        case 'rectangle':
            return t('workpiece_type_rectangle');
        case 'polygon':
            return t('workpiece_type_polygon');
        case 'triangle':
            return t('workpiece_type_triangle');
        default:
            return shapeType;
    }
}

// 将三角形类型转换为当前语言
function getTriangleTypeText(triangleType) {
    switch (triangleType) {
        case 'equilateral':
            return t('triangle_type_equilateral');
        case 'isosceles':
            return t('triangle_type_isosceles');
        default:
            return triangleType;
    }
}

// 将三角形朝向转换为当前语言
function getTriangleOrientationText(orientation) {
    switch (orientation) {
        case 'up':
            return t('triangle_orientation_up');
        case 'down':
            return t('triangle_orientation_down');
        case 'left':
            return t('triangle_orientation_left');
        case 'right':
            return t('triangle_orientation_right');
        default:
            return orientation;
    }
}

// 动态显示或隐藏配方预览页面的几何尺寸输入框
function updatePreviewInputFields(shapeType) {
    // 隐藏所有图形输入框
    document.querySelectorAll('.shape-input-preview').forEach(div => div.style.display = 'none');

    if (shapeType === 'circle') {
        document.getElementById('preview-circle-input').style.display = 'block';
    } else if (shapeType === 'rectangle') {
        document.getElementById('preview-rectangle-input').style.display = 'block';
    } else if (shapeType === 'polygon') {
        document.getElementById('preview-polygon-input').style.display = 'block';
    } else if (shapeType === 'triangle') {
        document.getElementById('preview-triangle-input').style.display = 'block';
        // 如果是等腰三角形，显示底边长输入框
        const triangleType = document.getElementById('triangle_type').value;
        if (triangleType === 'isosceles') {
            document.getElementById('preview-triangle-base-length').style.display = 'inline-block';
        } else {
            document.getElementById('preview-triangle-base-length').style.display = 'none';
        }
    }
}


// 预览配方
function previewRecipe(recipeName) {
    // 清理配方名称，移除可能存在的括号内容（如 "shou24(undefined)" -> "shou24"）
    const cleanRecipeName = recipeName.split('(')[0].trim();
    
    fetch('/get_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeName: cleanRecipeName }),
    })
    .then(response => response.json())
    .then(data => {
        // 检查是否为手动规划配方
        const isManualPlanning = data.isManualPlanning === true;
        
        // 更新预览标题，显示配方名称和类型标识
        const previewTitle = document.querySelector('.recipe-preview h2');
        if (previewTitle) {
            const recipePreviewText = t('recipe_preview');
            const manualPlanningText = t('menu_manual_planning');
            // 确保翻译文本不是 undefined 或 key 本身
            const safeRecipePreviewText = (recipePreviewText && recipePreviewText !== 'recipe_preview' && recipePreviewText !== 'undefined') 
                ? recipePreviewText 
                : '配方预览';
            const safeManualPlanningText = (manualPlanningText && manualPlanningText !== 'menu_manual_planning' && manualPlanningText !== 'undefined') 
                ? manualPlanningText 
                : '手动规划';
            if (isManualPlanning) {
                previewTitle.textContent = `${safeRecipePreviewText} - ${cleanRecipeName}(${safeManualPlanningText})`;
            } else {
                previewTitle.textContent = `${safeRecipePreviewText} - ${cleanRecipeName}`;
            }
        }
        
        // 如果是手动规划配方，显示简化的预览信息
        if (isManualPlanning) {
            showManualPlanningPreview(data);
            return;
        }

        // 智能规划配方：隐藏手动规划预览，显示智能规划预览
        const manualPreviewElement = document.querySelector('.manual-planning-preview');
        if (manualPreviewElement) {
            manualPreviewElement.style.display = 'none';
        }
        
        // 显示智能规划相关的元素
        const previewContainer = document.querySelector('.recipe-preview .preview-container');
        if (previewContainer) {
            const smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
            smartPlanningElements.forEach(element => {
                element.style.display = 'block';
            });
        }

        // 填充料框设置
        document.getElementById('preview-frame-length').textContent = data.frameLength;
        document.getElementById('preview-frame-width').textContent = data.frameWidth;
        document.getElementById('preview-frame-depth').textContent = data.frameDepth;

        // 填充工件设置
        const shapeTypeText = getShapeTypeText(data.shapeType); // 将图形类型转换为当前语言
        document.getElementById('preview-shape-type').textContent = shapeTypeText;

        // 根据工件类型显示对应的输入框
        updatePreviewInputFields(data.shapeType);

        // 填充工件参数
        if (data.shapeType === 'circle') {
            document.getElementById('preview-circle-diameter').textContent = data.circleDiameter || 'N/A';
        } else if (data.shapeType === 'rectangle') {
            document.getElementById('preview-rectangle-length').textContent = data.rectangleLength || 'N/A';
            document.getElementById('preview-rectangle-width').textContent = data.rectangleWidth || 'N/A';
        } else if (data.shapeType === 'polygon') {
            document.getElementById('preview-polygon-sides').textContent = data.polygonSides || 'N/A';
            document.getElementById('preview-polygon-side-length').textContent = data.polygonSideLength || 'N/A';
        } else if (data.shapeType === 'triangle') {
            const triangleTypeText = getTriangleTypeText(data.triangleType); // 转换为当前语言
            const triangleOrientationText = getTriangleOrientationText(data.triangleOrientation); // 转换为当前语言
            document.getElementById('preview-triangle-type').textContent = triangleTypeText || 'N/A';
            document.getElementById('preview-triangle-side-length').textContent = data.triangleSideLength || 'N/A';
            document.getElementById('preview-triangle-orientation').textContent = triangleOrientationText || 'N/A';
            // 如果是等腰三角形，显示底边长
            if (data.triangleType === 'isosceles') {
                document.getElementById('preview-triangle-base-length').textContent = data.triangleBaseLength || 'N/A';
                document.getElementById('preview-triangle-base-length-input').style.display = 'inline-block'; // 显示底边长输入框
            } else {
                document.getElementById('preview-triangle-base-length-input').style.display = 'none'; // 隐藏底边长输入框
            }
        }

        // 填充工件高度和下料数量
        document.getElementById('preview-shape-height').textContent = data.shapeHeight || 'N/A';
        document.getElementById('preview-drop-count').textContent = data.dropCount || 'N/A';

        // 填充摆放设置
        document.getElementById('preview-horizontal-spacing').textContent = data.horizontalSpacing;
        document.getElementById('preview-vertical-spacing').textContent = data.verticalSpacing;
        document.getElementById('preview-horizontal-border-distance').textContent = data.horizontalBorderDistance;
        document.getElementById('preview-vertical-border-distance').textContent = data.verticalBorderDistance;
        document.getElementById('preview-material-thickness').textContent = data.materialThickness;
        document.getElementById('preview-placement-layers').textContent = data.placementLayers;

        const layoutTypeText = data.layoutType === 'array' ? t('layout_type_array') : t('layout_type_honeycomb');
        const placeTypeText = data.placeType === 'row' ? t('place_type_row') : t('place_type_col');
        const remainderTurnText = data.remainderTurn === 'off' ? t('remainder_turn_off') : (data.remainderTurn === 'left' ? t('remainder_turn_left') : t('remainder_turn_right'));
        document.getElementById('preview-layout-type').textContent = layoutTypeText;
        document.getElementById('preview-place-type').textContent = placeTypeText;
        document.getElementById('preview-remainder-turn').textContent = remainderTurnText;

        // 显示预览图片
        const plotImg = document.getElementById('preview-plot');
        plotImg.src = data.plotImageBase64;
        plotImg.setAttribute('data-base64', data.plotImageBase64); // 添加这行，设置data-base64属性
        plotImg.style.display = 'block';
    })
    .catch(error => console.error('加载配方失败:', error));
}

// 显示手动规划配方预览（全局函数，供语言切换时调用）
window.showManualPlanningPreview = function(data) {
    // 隐藏智能规划相关的预览元素
    const previewContainer = document.querySelector('.recipe-preview .preview-container');
    if (previewContainer) {
        // 隐藏智能规划相关的元素
        const smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
        smartPlanningElements.forEach(element => {
            element.style.display = 'none';
        });
        
        // 检查是否已存在手动规划预览元素，如果不存在则创建
        let manualPreviewElement = previewContainer.querySelector('.manual-planning-preview');
        if (!manualPreviewElement) {
            manualPreviewElement = document.createElement('div');
            manualPreviewElement.className = 'manual-planning-preview';
            previewContainer.appendChild(manualPreviewElement);
        }
        
        // 存储数据以便语言切换时使用
        manualPreviewElement._recipeData = data;
        
        // 更新手动规划预览内容（使用翻译函数）
        // 获取所有翻译文本，确保不是undefined
        const manualPlanningRecipeInfoText = t('manual_planning_recipe_info');
        const recipeNameText = t('recipe_name');
        const recipeIdText = t('recipe_id');
        const pointTotalCountText = t('point_total_count');
        const rowCountText = t('row_count');
        const colCountText = t('col_count');
        const calculationMethodText = t('calculation_method');
        const calculationMethodRowText = t('calculation_method_row');
        const calculationMethodColText = t('calculation_method_col');
        
        // 确保所有翻译文本都不是undefined，如果是则使用中文作为后备
        // 检查翻译是否成功（不是key本身，不是undefined，不是null）
        // 如果翻译返回的是key本身，说明翻译不存在，使用后备文本
        const isTranslationValid = (text, key) => {
            return text && 
                   text !== key && 
                   text !== 'undefined' &&
                   text !== 'null' &&
                   typeof text === 'string' &&
                   text.length > 0;
        };
        
        const currentLang = getCurrentLanguage();
        const getFallbackText = (key, zhText, enText, viText, koText = enText) => {
            if (currentLang === 'ko') return koText;
            if (currentLang === 'vi') return viText;
            if (currentLang === 'en') return enText;
            return zhText;
        };
        
        const safeManualPlanningRecipeInfo = isTranslationValid(manualPlanningRecipeInfoText, 'manual_planning_recipe_info')
            ? manualPlanningRecipeInfoText 
            : getFallbackText('manual_planning_recipe_info', '手动规划配方信息', 'Manual Planning Recipe Info', 'Thông Tin Công Thức Lập Kế Hoạch Thủ Công', '수동 계획 레시피 정보');
        const safeRecipeName = isTranslationValid(recipeNameText, 'recipe_name')
            ? recipeNameText 
            : getFallbackText('recipe_name', '配方名:', 'Recipe Name:', 'Tên Công Thức:', '레시피 이름:');
        const safeRecipeId = isTranslationValid(recipeIdText, 'recipe_id')
            ? recipeIdText 
            : getFallbackText('recipe_id', '配方编号:', 'Recipe ID:', 'ID Công Thức:', '레시피 ID:');
        const safePointTotalCount = isTranslationValid(pointTotalCountText, 'point_total_count')
            ? pointTotalCountText 
            : getFallbackText('point_total_count', '点位总数:', 'Total Points:', 'Tổng Số Điểm:', '총 점 개수:');
        const safeRowCount = isTranslationValid(rowCountText, 'row_count')
            ? rowCountText 
            : getFallbackText('row_count', '行数:', 'Row Count:', 'Số Hàng:', '행 수:');
        const safeColCount = isTranslationValid(colCountText, 'col_count')
            ? colCountText 
            : getFallbackText('col_count', '列数:', 'Column Count:', 'Số Cột:', '열 수:');
        const safeCalculationMethod = isTranslationValid(calculationMethodText, 'calculation_method')
            ? calculationMethodText 
            : getFallbackText('calculation_method', '计算方式:', 'Calculation Method:', 'Phương Pháp Tính Toán:', '계산 방식:');
        const safeCalculationMethodRow = isTranslationValid(calculationMethodRowText, 'calculation_method_row')
            ? calculationMethodRowText 
            : getFallbackText('calculation_method_row', '行优先', 'Row Priority', 'Ưu Tiên Hàng', '행 우선');
        const safeCalculationMethodCol = isTranslationValid(calculationMethodColText, 'calculation_method_col')
            ? calculationMethodColText 
            : getFallbackText('calculation_method_col', '列优先', 'Column Priority', 'Ưu Tiên Cột', '열 우선');
        
        const finalCalculationMethodText = data.manualPlanningInfo && data.manualPlanningInfo.calculationMethod === 'row_priority' 
            ? safeCalculationMethodRow 
            : safeCalculationMethodCol;
        
        manualPreviewElement.innerHTML = `
            <h3>${safeManualPlanningRecipeInfo}</h3>
            <div class="manual-planning-info">
                <p><strong>${safeRecipeName}</strong> ${data.recipeName || ''}</p>
                <p><strong>${safeRecipeId}</strong> ${data.recipeId || ''}</p>
                <p><strong>${safePointTotalCount}</strong> ${data.tableData ? data.tableData.length : 0}</p>
                ${data.manualPlanningInfo ? `
                    <p><strong>${safeRowCount}</strong> ${data.manualPlanningInfo.rowCount || ''}</p>
                    <p><strong>${safeColCount}</strong> ${data.manualPlanningInfo.colCount || ''}</p>
                    <p><strong>${safeCalculationMethod}</strong> ${finalCalculationMethodText}</p>
                ` : ''}
            </div>
        `;
        
        // 显示手动规划预览
        manualPreviewElement.style.display = 'block';
    }
};

// 清除智能规划界面的所有参数和图片
function clearSmartPlanningInterface() {
    // 清除所有输入框的值
    const inputFields = [
        'frame_length', 'frame_width', 'frame_depth', 'shape_height', 'material_thickness',
        'placement_layers', 'shape_type', 'shape_length', 'shape_width', 'drop_count',
        'horizontal_spacing', 'vertical_spacing', 'horizontal_border_distance', 'vertical_border_distance',
        'layout_type', 'place_type', 'remainder_turn', 'shape_count_value', 'shapes_per_row_or_col_value',
        'circle_diameter', 'rectangle_length', 'rectangle_width', 'polygon_sides', 'polygon_side_length',
        'polygon_arrangement', 'triangle_type', 'triangle_side_length', 'triangle_base_length', 'triangle_orientation'
    ];
    
    inputFields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            if (element.type === 'select-one') {
                element.selectedIndex = 0; // 重置为第一个选项
            } else {
                element.value = '';
            }
        }
    });
    
    // 清除预览图片
    const plotImg = document.getElementById('plot');
    if (plotImg) {
        plotImg.src = '';
        plotImg.style.display = 'none';
        plotImg.removeAttribute('data-base64');
    }
    
    // 清除预览图片
    const previewPlotImg = document.getElementById('preview-plot');
    if (previewPlotImg) {
        previewPlotImg.src = '';
        previewPlotImg.style.display = 'none';
        previewPlotImg.removeAttribute('data-base64');
    }
    
    console.log('智能规划界面已清除');
}

// 重置配方预览状态
function resetRecipePreview() {
    const previewContainer = document.querySelector('.recipe-preview .preview-container');
    if (previewContainer) {
        // 隐藏手动规划预览
        const manualPreviewElement = previewContainer.querySelector('.manual-planning-preview');
        if (manualPreviewElement) {
            manualPreviewElement.style.display = 'none';
        }
        
        // 显示智能规划相关的元素
        const smartPlanningElements = previewContainer.querySelectorAll('.input-container, .preview-image-container');
        smartPlanningElements.forEach(element => {
            element.style.display = 'block';
        });
    }
}

// 从配方数据填充数据清单表格
function fillDataListTableFromRecipe(tableData) {
    const tableBody = document.querySelector('#data-list-content table tbody');
    tableBody.innerHTML = ''; // 清空现有数据
    
    if (tableData && Array.isArray(tableData)) {
        tableData.forEach((rowData) => {
            const row = document.createElement('tr');
            
            // 行号
            const cell1 = document.createElement('td');
            cell1.textContent = rowData.rowNumber || '';
            cell1.style.border = '1px solid #ddd';
            cell1.style.padding = '8px';
            row.appendChild(cell1);
            
            // 列号
            const cell2 = document.createElement('td');
            cell2.textContent = rowData.colNumber || '';
            cell2.style.border = '1px solid #ddd';
            cell2.style.padding = '8px';
            row.appendChild(cell2);
            
            // P_ID
            const cell3 = document.createElement('td');
            cell3.textContent = rowData.pId || '';
            cell3.style.border = '1px solid #ddd';
            cell3.style.padding = '8px';
            row.appendChild(cell3);
            
            // X坐标
            const cell4 = document.createElement('td');
            cell4.textContent = (parseFloat(rowData.x) || 0).toFixed(2);
            cell4.style.border = '1px solid #ddd';
            cell4.style.padding = '8px';
            row.appendChild(cell4);
            
            // X补偿
            const cell5 = document.createElement('td');
            cell5.textContent = (parseFloat(rowData.xCompensation) || 0).toFixed(2);
            cell5.style.border = '1px solid #ddd';
            cell5.style.padding = '8px';
            row.appendChild(cell5);
            
            // Y坐标
            const cell6 = document.createElement('td');
            cell6.textContent = (parseFloat(rowData.y) || 0).toFixed(2);
            cell6.style.border = '1px solid #ddd';
            cell6.style.padding = '8px';
            row.appendChild(cell6);
            
            // Y补偿
            const cell7 = document.createElement('td');
            cell7.textContent = (parseFloat(rowData.yCompensation) || 0).toFixed(2);
            cell7.style.border = '1px solid #ddd';
            cell7.style.padding = '8px';
            row.appendChild(cell7);
            
            // C坐标
            const cell8 = document.createElement('td');
            cell8.textContent = (parseFloat(rowData.c) || 0).toFixed(2);
            cell8.style.border = '1px solid #ddd';
            cell8.style.padding = '8px';
            row.appendChild(cell8);
            
            // C补偿
            const cell9 = document.createElement('td');
            cell9.textContent = (parseFloat(rowData.cCompensation) || 0).toFixed(2);
            cell9.style.border = '1px solid #ddd';
            cell9.style.padding = '8px';
            row.appendChild(cell9);
            
            tableBody.appendChild(row);
        });
    }
}

// 删除配方
async function deleteRecipe(recipeName) {
    const confirmDelete = await myConfirm(`确定要删除配方 "${recipeName}" 吗？`);
    if (confirmDelete) {
        fetch('/delete_recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ recipeName }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    loadRecipeList(); // 重新加载配方列表
                } else {
                    alertError('删除配方失败');
                }
            })
            .catch(error => console.error('删除配方失败:', error));
    }
}

// 读取配方到智能规划页面
function loadRecipeToPlanning(recipeName) {
    fetch('/get_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeName }),
    })
    .then(response => response.json())
    .then(data => {
        // 检查是否为手动规划配方
        const isManualPlanning = data.isManualPlanning === true;
        
        if (isManualPlanning) {
            // 清除智能规划界面的所有参数和图片，防止干扰
            clearSmartPlanningInterface();
            
            // 设置全局状态标记，标识当前为手动规划配方
            window.currentRecipeType = 'manual';
            
            // 手动规划配方：只填充数据清单表格
            fillDataListTableFromRecipe(data.tableData);
            
            // 填充配方名和配方编号到数据清单的输入框中
            document.getElementById('recipe_name').value = recipeName;
            document.getElementById('recipe_id').value = data.recipeId;
            
            // 填充手动规划的行数、列数和计算方式到输入框中，确保写入R寄存器时能正确获取
            if (data.manualPlanningInfo) {
                const rowCountInput = document.getElementById('row_count');
                const colCountInput = document.getElementById('col_count');
                const calculationMethodInput = document.getElementById('calculation_method');
                if (rowCountInput && colCountInput) {
                    rowCountInput.value = data.manualPlanningInfo.rowCount || '';
                    colCountInput.value = data.manualPlanningInfo.colCount || '';
                }
                if (calculationMethodInput) {
                    calculationMethodInput.value = data.manualPlanningInfo.calculationMethod || 'row_priority';
                }
            }
            
            // 显示数据清单页面
            showSection('data-list-content');
            setActiveButton('data-list-btn');
            return;
        }
        
        // 智能规划配方：设置全局状态标记
        window.currentRecipeType = 'smart';
        
        // 智能规划配方：填充所有参数
        document.getElementById('frame_length').value = data.frameLength;
        document.getElementById('frame_width').value = data.frameWidth;
        document.getElementById('frame_depth').value = data.frameDepth;
        document.getElementById('shape_type').value = data.shapeType;
        document.getElementById('shape_height').value = data.shapeHeight;
        document.getElementById('drop_Count').value = data.dropCount;
        document.getElementById('horizontal_spacing').value = data.horizontalSpacing;
        document.getElementById('vertical_spacing').value = data.verticalSpacing;
        document.getElementById('horizontal_border_distance').value = data.horizontalBorderDistance;
        document.getElementById('vertical_border_distance').value = data.verticalBorderDistance;
        document.getElementById('material_thickness').value = data.materialThickness;
        document.getElementById('placement_layers').value = data.placementLayers;
        document.getElementById('layout_type').value = data.layoutType;
        document.getElementById('place_type').value = data.placeType;
        document.getElementById('remainder_turn').value = data.remainderTurn;

        // 根据工件类型填充相应的参数
        if (data.shapeType === 'circle') {
            document.getElementById('circle_diameter').value = data.circleDiameter;
        } else if (data.shapeType === 'rectangle') {
            document.getElementById('rectangle_length').value = data.rectangleLength;
            document.getElementById('rectangle_width').value = data.rectangleWidth;
        } else if (data.shapeType === 'polygon') {
            document.getElementById('polygon_sides').value = data.polygonSides;
            document.getElementById('polygon_side_length').value = data.polygonSideLength;
            document.getElementById('polygon_arrangement').value = data.polygonArrangement || 'diagonal';  // 添加多边形排布方式参数
        } else if (data.shapeType === 'triangle') {
            document.getElementById('triangle_type').value = data.triangleType;
            document.getElementById('triangle_side_length').value = data.triangleSideLength;
            // 如果是等腰三角形，填充底边长
            if (data.triangleType === 'isosceles') {
                document.getElementById('triangle_base_length').value = data.triangleBaseLength;
                document.getElementById('triangle_base_length_input').style.display = 'block'; // 显示底边长输入框
            } else {
                document.getElementById('triangle_base_length_input').style.display = 'none'; // 隐藏底边长输入框
            }
            document.getElementById('triangle_orientation').value = data.triangleOrientation;
        }

        // 手动触发工件类型的 change 事件，以更新输入框显示状态
        const shapeTypeSelect = document.getElementById('shape_type');
        shapeTypeSelect.dispatchEvent(new Event('change'));

        // 填充结果预览图片
        const plotImg = document.getElementById('plot');
        plotImg.src = data.plotImageBase64;
        plotImg.setAttribute('data-base64', data.plotImageBase64); // 添加这行，设置data-base64属性
        plotImg.style.display = 'block';

        // 填充填充数量和单行/列数量
        document.getElementById('shape-count-value').textContent = data.shapeCountValue;
        document.getElementById('shapes-per-row-or-col-value').textContent = data.shapesPerRowOrColValue;

        // 显示填充数量和单行/列数量
        document.getElementById('shape-count').style.display = 'block';
        document.getElementById('shapes-per-row-or-col').style.display = 'block';

        // 填充数据清单页面
        const tableBody = document.querySelector('#data-list-content table tbody');
        tableBody.innerHTML = ''; // 清空表格内容

        if (data.tableData && Array.isArray(data.tableData)) {
            data.tableData.forEach((rowData) => {
                const row = document.createElement('tr');

                // 行号
                const cell1 = document.createElement('td');
                cell1.textContent = rowData.rowNumber || '';
                cell1.style.border = '1px solid #ddd';
                cell1.style.padding = '8px';
                row.appendChild(cell1);

                // 列号
                const cell2 = document.createElement('td');
                cell2.textContent = rowData.colNumber || '';
                cell2.style.border = '1px solid #ddd';
                cell2.style.padding = '8px';
                row.appendChild(cell2);

                // P_ID
                const cell3 = document.createElement('td');
                cell3.textContent = rowData.pId || '';
                cell3.style.border = '1px solid #ddd';
                cell3.style.padding = '8px';
                row.appendChild(cell3);

                // X坐标
                const cell4 = document.createElement('td');
                cell4.textContent = (parseFloat(rowData.x) || 0).toFixed(2);
                cell4.style.border = '1px solid #ddd';
                cell4.style.padding = '8px';
                row.appendChild(cell4);

                // X补偿
                const cell5 = document.createElement('td');
                cell5.textContent = (parseFloat(rowData.xCompensation) || 0).toFixed(2);
                cell5.style.border = '1px solid #ddd';
                cell5.style.padding = '8px';
                row.appendChild(cell5);

                // Y坐标
                const cell6 = document.createElement('td');
                cell6.textContent = (parseFloat(rowData.y) || 0).toFixed(2);
                cell6.style.border = '1px solid #ddd';
                cell6.style.padding = '8px';
                row.appendChild(cell6);

                // Y补偿
                const cell7 = document.createElement('td');
                cell7.textContent = (parseFloat(rowData.yCompensation) || 0).toFixed(2);
                cell7.style.border = '1px solid #ddd';
                cell7.style.padding = '8px';
                row.appendChild(cell7);

                // C坐标
                const cell8 = document.createElement('td');
                cell8.textContent = (parseFloat(rowData.c) || 0).toFixed(2);
                cell8.style.border = '1px solid #ddd';
                cell8.style.padding = '8px';
                row.appendChild(cell8);

                // C补偿
                const cell9 = document.createElement('td');
                cell9.textContent = (parseFloat(rowData.cCompensation) || 0).toFixed(2);
                cell9.style.border = '1px solid #ddd';
                cell9.style.padding = '8px';
                row.appendChild(cell9);

                tableBody.appendChild(row);
            });
        }

        // 填充配方名和配方编号到数据清单的输入框中
        document.getElementById('recipe_name').value = recipeName;
        document.getElementById('recipe_id').value = data.recipeId; // 填充配方编号

        // 检查是否来自外部调用监控
        const isFromExternalCall = window.isFromExternalCall;
        if (isFromExternalCall) {
            // 如果是外部调用，显示数据清单页面
            showSection('data-list-content');
            setActiveButton('data-list-btn');
            window.isFromExternalCall = false; // 重置标志位
        } else {
            // 如果是手动加载，也显示数据清单页面
            showSection('data-list-content');
            setActiveButton('data-list-btn');
        }
    })
    .catch(error => console.error('加载配方失败:', error));
}

// 配方库界面选择框显示控制
function updateExternalCallVisibility() {
    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    const finishSignal = document.getElementById('finish-signal').value;
    const externalCallContainer = document.getElementById('external-call-container');
    const autoWriteContainer = document.getElementById('auto-write-container');
    const externalCallStatus = document.getElementById('external-call-status');

    // 只有当配方号、调用信号DI、完成信号DO都输入了值时才显示选择框
    if (recipeNumber && callSignal && finishSignal) {
        externalCallContainer.style.display = 'block';
        autoWriteContainer.style.display = 'block';
        externalCallStatus.style.display = 'block';
    } else {
        externalCallContainer.style.display = 'none';
        autoWriteContainer.style.display = 'none';
        externalCallStatus.style.display = 'none';
        // 如果隐藏选择框，也要停止监控
        stopExternalCallMonitor();
    }
}

// 更新状态显示
function updateStatusDisplay(message, type = 'normal') {
    const statusText = document.getElementById('status-text');
    const statusContainer = document.getElementById('external-call-status');

    if (statusText) {
        statusText.textContent = message;
    }

    if (statusContainer) {
        // 移除所有状态类
        statusContainer.classList.remove('monitoring', 'triggered', 'error', 'processing', 'success');

        // 根据类型添加相应的类
        if (type === 'monitoring') {
            statusContainer.classList.add('monitoring');
        } else if (type === 'triggered') {
            statusContainer.classList.add('triggered');
        } else if (type === 'error') {
            statusContainer.classList.add('error');
        } else if (type === 'processing') {
            statusContainer.classList.add('processing');
        } else if (type === 'success') {
            statusContainer.classList.add('success');
        }
    }
}

// 触发完成信号
function triggerFinishSignal() {
    const finishSignal = document.getElementById('finish-signal').value;

    if (!finishSignal) {
        console.log('未设置完成信号DO，跳过DO信号触发');
        return;
    }

    console.log(`自动写入完成，开始触发DO${finishSignal}信号`);

    // 设置DO信号为1
    fetch('/set_do_signal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            do_number: finishSignal,
            do_value: 1
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`DO${finishSignal}信号设置为1成功`);
            updateStatusDisplay(`DO${finishSignal}信号已设置为1，1秒后将重置为0`, 'processing');

            // 1秒后将DO信号设为0
            setTimeout(() => {
                fetch('/set_do_signal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        do_number: finishSignal,
                        do_value: 0
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(`DO${finishSignal}信号重置为0成功`);
                        updateStatusDisplay(`DO${finishSignal}信号已重置为0，自动写入流程完成`, 'success');
                    } else {
                        console.error(`DO${finishSignal}信号重置为0失败:`, data.error);
                        updateStatusDisplay(`DO${finishSignal}信号重置失败: ${data.error}`, 'error');
                    }
                })
                .catch(error => {
                    console.error(`DO${finishSignal}信号重置为0请求失败:`, error);
                    updateStatusDisplay(`DO${finishSignal}信号重置请求失败: ${error.message}`, 'error');
                });
            }, 1000); // 1秒延迟

        } else {
            console.error(`DO${finishSignal}信号设置为1失败:`, data.error);
            updateStatusDisplay(`DO${finishSignal}信号设置失败: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        console.error(`DO${finishSignal}信号设置为1请求失败:`, error);
        updateStatusDisplay(`DO${finishSignal}信号设置请求失败: ${error.message}`, 'error');
    });
}


// 配方操作相关函数
function setupRecipeOperationListeners() {
    // 全选/取消全选（仅在插件环境中显示和工作）
    const selectAllCheckbox = document.getElementById('select-all-recipes');
    const operateDiv = document.querySelector('.recipe-operations');

    if (selectAllCheckbox) {
        if (isTP) {
            selectAllCheckbox.addEventListener('change', function() {
                const recipeCheckboxes = document.querySelectorAll('.recipe-checkbox');
                recipeCheckboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        } else {
            // 在非插件环境中隐藏全选勾选框
            operateDiv.style.display = 'none';
        }
    }

    // 导出选中配方
    const exportButton = document.getElementById('export-selected-recipes');
    if (exportButton) {
        exportButton.addEventListener('click', exportSelectedRecipes);
        // 如果不是在插件环境中，隐藏导出按钮
        if (!isTP) {
            exportButton.style.display = 'none';
        }
    }

    // 导入配方
    const importButton = document.getElementById('import-recipes');
    if (importButton) {
        importButton.addEventListener('click', importRecipes);
        // 如果不是在插件环境中，隐藏导入按钮
        if (!isTP) {
            importButton.style.display = 'none';
        }
    }
}

// 获取选中的配方
function getSelectedRecipes() {
    const selectedCheckboxes = document.querySelectorAll('.recipe-checkbox:checked');
    return Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
}

// 导出选中的配方
function exportSelectedRecipes() {
    const selectedRecipes = getSelectedRecipes();

    if (selectedRecipes.length === 0) {
        alertError('请选择要导出的配方');
        return;
    }

    console.log(selectedRecipes);
    fetch('/export_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recipe_ids: selectedRecipes
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alertError(`导出配方失败: ${data.error}`);
            return;
        }

        // 导出成功
        alertSuccess(data.message || `成功导出 ${selectedRecipes.length} 个配方到U盘`);
    })
    .catch(error => {
        alertError(`导出配方失败: ${error.message}`);
    });
}

// 导入配方
function importRecipes() {
    // 首先获取U盘中的备份时间目录列表
    fetch('/get_backup_timestamps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alertError(`读取U盘备份目录失败: ${data.error}`);
            return;
        }

        if (data.count === 0) {
            alertInfo('U盘中没有找到配方备份目录');
            return;
        }

        // 显示时间目录选择对话框
        showTimestampSelectionDialog(data.timestamps);
    })
    .catch(error => {
        alertError(`读取U盘备份目录失败: ${error.message}`);
    });
}

// 显示时间目录选择对话框
function showTimestampSelectionDialog(timestamps) {
    const dialog = document.createElement('div');
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `
        <div class="modal-content import-dialog">
            <div class="modal-header">
                <h3>选择备份时间</h3>
                <button class="close-modal" onclick="closeImportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <p>请选择要导入的配方备份时间：</p>
                <div class="timestamp-list">
                    ${generateTimestampList(timestamps)}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeImportDialog()">取消</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    dialog.classList.add('show');
}

// 生成时间目录列表HTML
function generateTimestampList(timestamps) {
    return timestamps.map(timestamp => {
        return `
            <div class="timestamp-item" onclick="selectTimestamp('${timestamp.timestamp}')">
                <div class="timestamp-info">
                    <div class="timestamp-display">${timestamp.display_time}</div>
                    <div class="timestamp-details">
                        <span class="recipe-count">${timestamp.recipe_count} 个配方</span>
                        ${timestamp.export_date ? `<span class="export-date">导出时间: ${timestamp.export_date}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 选择时间戳并获取该目录下的配方
function selectTimestamp(timestamp) {
    // 获取指定时间目录中的配方列表
    fetch('/get_usb_recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            timestamp: timestamp
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alertError(`读取配方失败: ${data.error}`);
            return;
        }

        if (data.count === 0) {
            alertInfo('该时间目录中没有找到配方文件');
            return;
        }

        // 关闭时间选择对话框，显示配方导入对话框
        closeImportDialog();
        showImportDialog(data.recipes, timestamp);
    })
    .catch(error => {
        alertError(`读取配方失败: ${error.message}`);
    });
}

// 显示导入对话框
function showImportDialog(usbRecipes, timestamp) {
    // 创建模态对话框
    const dialog = document.createElement('div');
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `
        <div class="modal-content import-dialog">
            <div class="modal-header">
                <h3>从U盘导入配方</h3>
                <button class="close-modal" onclick="closeImportDialog()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="import-recipe-controls">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" id="import-select-all" onchange="toggleAllImportRecipes()">
                        <span class="checkbox-text">全选</span>
                    </label>
                    <div class="import-info">
                        来源: ${timestamp} | 找到 ${usbRecipes.length} 个配方文件
                    </div>
                </div>
                <div class="import-recipe-list" id="import-recipe-list">
                    ${generateImportRecipeList(usbRecipes)}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeImportDialog()">取消</button>
                <button class="btn btn-primary" onclick="confirmImportRecipes('${timestamp}')">导入选中配方</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);
    dialog.classList.add('show');
}

// 生成导入配方列表HTML
function generateImportRecipeList(usbRecipes) {
    return usbRecipes.map(recipe => {
        const errorText = recipe.error ? ` <span class="error-text">(${recipe.error})</span>` : '';

        return `
            <div class="import-recipe-item">
                <label class="checkbox-wrapper">
                    <input type="checkbox" class="import-recipe-checkbox" value="${recipe.filename}"
                           onchange="updateImportSelectAllState()" ${recipe.error ? 'disabled' : ''}>
                    <div class="recipe-info">
                        <div class="recipe-name">${recipe.recipeName}${errorText}</div>
                        <div class="recipe-details">
                            <span class="recipe-id">ID: ${recipe.recipeId || '无'}</span>
                        </div>
                    </div>
                </label>
            </div>
        `;
    }).join('');
}

// 全选/取消全选导入配方
function toggleAllImportRecipes() {
    const selectAllCheckbox = document.getElementById('import-select-all');
    const recipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:not(:disabled)');

    recipeCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// 更新导入全选状态
function updateImportSelectAllState() {
    const selectAllCheckbox = document.getElementById('import-select-all');
    const allRecipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:not(:disabled)');
    const checkedRecipeCheckboxes = document.querySelectorAll('.import-recipe-checkbox:checked');

    if (selectAllCheckbox) {
        if (checkedRecipeCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedRecipeCheckboxes.length === allRecipeCheckboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
}

// 确认导入配方
async function confirmImportRecipes(timestamp) {
    const selectedCheckboxes = document.querySelectorAll('.import-recipe-checkbox:checked');
    const selectedFilenames = Array.from(selectedCheckboxes).map(cb => cb.value);

    if (selectedFilenames.length === 0) {
        alertError('请选择要导入的配方');
        return;
    }

    // 确认导入
    const confirmed = await myConfirm(`确认导入 ${selectedFilenames.length} 个配方？`);
    if (confirmed) {
        executeImport(selectedFilenames, timestamp);
    }
}

// 执行导入操作
async function executeImport(filenames, timestamp) {
    try {
        // 初始化跳过计数
        window.manuallySkippedCount = 0;

        // 1. 先检查重名冲突（配方号冲突会自动处理）
        const conflictResult = await checkImportConflicts(filenames, timestamp);

        let conflictAction = 'proceed'; // 默认继续导入

        // 2. 如果有配方号重新分配的情况，先显示信息
        if (conflictResult.hasIdReassignments) {
            const continueImport = await showIdReassignmentDialog(conflictResult.idReassignments);
            if (!continueImport) {
                return; // 用户取消导入
            }
        }

        // 3. 如果有重名冲突，逐个询问用户处理方式
        if (conflictResult.hasNameConflicts) {
            const resolvedConflicts = await resolveNameConflictsOneByOne(conflictResult.nameConflicts);

            if (resolvedConflicts.cancelled) {
                return; // 用户取消导入
            }

            // 根据用户的决定过滤要导入的文件
            const originalFileCount = filenames.length;
            const skippedConflicts = resolvedConflicts.decisions.filter(d => d.action === 'skip');

            filenames = filenames.filter(filename => {
                const conflict = resolvedConflicts.decisions.find(d => d.filename === filename);
                return !conflict || conflict.action !== 'skip';
            });

            if (filenames.length === 0) {
                alertInfo('所有配方都被跳过，导入已取消');
                return;
            }

            conflictAction = 'overwrite'; // 剩余的文件都是要覆盖的

            // 记录跳过的重名配方数量，用于最后的结果显示
            window.manuallySkippedCount = skippedConflicts.length;
        }

        // 4. 执行实际导入
        const response = await fetch('/import_recipes_from_usb', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filenames: filenames,
                timestamp: timestamp,
                conflict_action: conflictAction
            }),
        });

        const data = await response.json();

        if (data.error) {
            alertError(`导入失败: ${data.error}`);
            return;
        }

        // 显示导入结果
        let message = data.message;

        // 添加手动跳过的重名配方信息
        if (window.manuallySkippedCount && window.manuallySkippedCount > 0) {
            const parts = message.split('成功导入');
            if (parts.length === 2) {
                message = parts[0] + `成功导入${parts[1].split('个配方')[0]}个配方，手动跳过 ${window.manuallySkippedCount} 个重名配方${parts[1].substring(parts[1].indexOf('个配方') + 3)}`;
            }
            delete window.manuallySkippedCount; // 清理全局变量
        }

        // 添加重新分配的配方号信息
        if (data.reassigned_list && data.reassigned_list.length > 0) {
            message += '\n\n配方号自动重新分配详情:\n' + data.reassigned_list.join('\n');
        }

        if (data.errors && data.errors.length > 0) {
            message += '\n\n错误详情:\n' + data.errors.join('\n');
        }

        alertSuccess(message);
        closeImportDialog();

        // 刷新配方列表
        loadRecipeList();

    } catch (error) {
        alertError(`导入失败: ${error.message}`);
    }
}

// 检查导入冲突
async function checkImportConflicts(filenames, timestamp) {
    try {
        const response = await fetch('/check_import_conflicts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filenames: filenames,
                timestamp: timestamp
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return {
            hasNameConflicts: data.hasNameConflicts,
            hasIdReassignments: data.hasIdReassignments,
            nameConflicts: data.nameConflicts,
            idReassignments: data.idReassignments
        };

    } catch (error) {
        console.error('检查导入冲突失败:', error);
        return { hasNameConflicts: false, hasIdReassignments: false, nameConflicts: [], idReassignments: [] };
    }
}



// 显示配方号重新分配确认对话框
async function showIdReassignmentDialog(idReassignments) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content conflict-dialog">
                <div class="modal-header">
                    <h3>配方号自动分配通知</h3>
                    <button class="close-modal" onclick="resolveIdReassignment(false)">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="conflict-message">以下配方存在配方号重复，系统将自动分配新的配方号：</p>
                    <div class="conflict-list">
                        ${generateIdReassignmentList(idReassignments)}
                    </div>
                    <div class="conflict-note">
                        <p><strong>说明：</strong>这些配方的内容不会改变，只是配方号会被重新分配到可用的号码。</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="resolveIdReassignment(false)">取消导入</button>
                    <button class="btn btn-primary" onclick="resolveIdReassignment(true)">确认继续</button>
                </div>
            </div>
        `;

        // 添加全局解决函数
        window.resolveIdReassignment = (proceed) => {
            document.body.removeChild(dialog);
            delete window.resolveIdReassignment;
            resolve(proceed);
        };

        document.body.appendChild(dialog);
        dialog.classList.add('show');
    });
}

// 逐个解决重名冲突
async function resolveNameConflictsOneByOne(nameConflicts) {
    const decisions = [];

    for (let i = 0; i < nameConflicts.length; i++) {
        const conflict = nameConflicts[i];
        const decision = await showSingleNameConflictDialog(conflict, i + 1, nameConflicts.length);

        if (decision.action === 'cancel') {
            return { cancelled: true, decisions: [] };
        }

        if (decision.action === 'skip_all') {
            // 跳过所有剩余的重名配方
            for (let j = i; j < nameConflicts.length; j++) {
                decisions.push({
                    filename: nameConflicts[j].filename,
                    action: 'skip'
                });
            }
            break;
        }

        if (decision.action === 'overwrite_all') {
            // 覆盖所有剩余的重名配方
            for (let j = i; j < nameConflicts.length; j++) {
                decisions.push({
                    filename: nameConflicts[j].filename,
                    action: 'overwrite'
                });
            }
            break;
        }

        decisions.push({
            filename: conflict.filename,
            action: decision.action
        });
    }

    return { cancelled: false, decisions };
}

// 显示单个重名冲突确认对话框
async function showSingleNameConflictDialog(conflict, current, total) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content conflict-dialog">
                <div class="modal-header">
                    <h3>配方重名确认 (${current}/${total})</h3>
                    <button class="close-modal" onclick="resolveSingleNameConflict('cancel')">&times;</button>
                </div>
                <div class="modal-body">
                    <p class="conflict-message">发现配方重名冲突，请选择处理方式：</p>
                    <div class="conflict-list">
                        ${generateSingleNameConflictInfo(conflict)}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="resolveSingleNameConflict('cancel')">取消导入</button>
                    <button class="btn btn-warning" onclick="resolveSingleNameConflict('skip')">跳过此配方</button>
                    <button class="btn btn-danger" onclick="resolveSingleNameConflict('overwrite')">覆盖此配方</button>
                    ${total > 1 && current < total ? `
                        <hr style="margin: 10px 0;">
                        <button class="btn btn-warning btn-sm" onclick="resolveSingleNameConflict('skip_all')">跳过所有剩余</button>
                        <button class="btn btn-danger btn-sm" onclick="resolveSingleNameConflict('overwrite_all')">覆盖所有剩余</button>
                    ` : ''}
                </div>
            </div>
        `;

        // 添加全局解决函数
        window.resolveSingleNameConflict = (action) => {
            document.body.removeChild(dialog);
            delete window.resolveSingleNameConflict;
            resolve({ action });
        };

        document.body.appendChild(dialog);
        dialog.classList.add('show');
    });
}

// 生成单个重名冲突信息HTML
function generateSingleNameConflictInfo(conflict) {
    return `
        <div class="conflict-item">
            <div class="conflict-info">
                <strong>文件：${conflict.filename}</strong>
            </div>
            <div class="conflict-details">
                <span class="conflict-type">冲突类型：配方名称重复</span>
                <div class="conflict-comparison">
                    <div class="usb-recipe">
                        <span class="label">U盘配方：</span>
                        <span class="recipe-name">${conflict.usbRecipeName}</span>
                        <span class="recipe-id">(ID: ${conflict.usbRecipeId || '无'})</span>
                    </div>
                    <div class="local-recipe">
                        <span class="label">本地配方：</span>
                        <span class="recipe-name">${conflict.localRecipeName}</span>
                        <span class="recipe-id">(ID: ${conflict.localRecipeId || '无'})</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 生成配方号重新分配列表HTML
function generateIdReassignmentList(idReassignments) {
    return idReassignments.map(reassignment => {
        return `
            <div class="conflict-item">
                <div class="conflict-info">
                    <strong>文件：${reassignment.filename}</strong>
                </div>
                <div class="conflict-details">
                    <span class="conflict-type">配方：${reassignment.recipeName}</span>
                    <div class="conflict-comparison">
                        <div class="usb-recipe">
                            <span class="label">原配方号：</span>
                            <span class="recipe-id">${reassignment.originalId}</span>
                        </div>
                        <div class="local-recipe">
                            <span class="label">新配方号：</span>
                            <span class="recipe-id">${reassignment.newId}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}



// 显示配方名冲突对话框（用于保存配方时）
async function showNameConflictDialog(recipeName) {
    return new Promise((resolve) => {
        // 创建模态对话框
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content conflict-dialog">
                <div class="modal-header">
                    <h3>配方名称冲突</h3>
                </div>
                <div class="modal-body">
                    <div class="conflict-info">
                        <p><strong>配方名称 "${recipeName}" 已存在</strong></p>
                        <p>继续保存将覆盖现有的配方文件，请确认是否继续？</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancel-save">取消保存</button>
                    <button class="btn btn-danger" id="overwrite-recipe">覆盖现有配方</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.classList.add('show');

        // 绑定事件
        const cancelBtn = dialog.querySelector('#cancel-save');
        const overwriteBtn = dialog.querySelector('#overwrite-recipe');

        const cleanup = () => {
            document.body.removeChild(dialog);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve({ cancelled: true });
        };

        overwriteBtn.onclick = () => {
            cleanup();
            resolve({ cancelled: false });
        };

        // ESC键关闭
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleEsc);
                resolve({ cancelled: true });
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}

// 显示ID冲突对话框（用于保存配方时）
async function showIdConflictDialog(conflictData) {
    return new Promise((resolve) => {
        // 创建模态对话框
        const dialog = document.createElement('div');
        dialog.className = 'modal-overlay';
        dialog.innerHTML = `
            <div class="modal-content conflict-dialog">
                <div class="modal-header">
                    <h3>配方编号冲突</h3>
                </div>
                <div class="modal-body">
                    <div class="conflict-info">
                        <p><strong>配方编号 ${conflictData.original_id} 已被配方 "${conflictData.conflicting_recipe_name}" 使用</strong></p>
                        <p>系统建议使用新的配方编号：<strong>${conflictData.suggested_id}</strong></p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" id="cancel-save">取消保存</button>
                    <button class="btn btn-primary" id="use-new-id">使用新编号 ${conflictData.suggested_id}</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        dialog.classList.add('show');

        // 绑定事件
        const cancelBtn = dialog.querySelector('#cancel-save');
        const useNewIdBtn = dialog.querySelector('#use-new-id');

        const cleanup = () => {
            document.body.removeChild(dialog);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve({ cancelled: true });
        };

        useNewIdBtn.onclick = () => {
            cleanup();
            resolve({ 
                cancelled: false, 
                useNewId: true, 
                newId: conflictData.suggested_id 
            });
        };

        // ESC键关闭
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                cleanup();
                document.removeEventListener('keydown', handleEsc);
                resolve({ cancelled: true });
            }
        };
        document.addEventListener('keydown', handleEsc);
    });
}

// 关闭导入对话框
function closeImportDialog() {
    const dialog = document.querySelector('.modal-overlay');
    if (dialog) {
        dialog.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(dialog);
        }, 300);
    }
}

// 更新全选状态
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all-recipes');
    const allRecipeCheckboxes = document.querySelectorAll('.recipe-checkbox');
    const checkedRecipeCheckboxes = document.querySelectorAll('.recipe-checkbox:checked');

    if (selectAllCheckbox) {
        if (checkedRecipeCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedRecipeCheckboxes.length === allRecipeCheckboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
}