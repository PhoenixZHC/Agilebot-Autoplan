// 判断当前环境是否运行在插件中，选择不同的提示框
const isExtension = gbtExtension.isInExtension();
// TP插件环境中，alert无法使用
const alertSuccess =
  !isExtension
    ? alert
    : gbtExtension.rtmNotification.success;
const alertError =
  !isExtension
    ? alert
    : gbtExtension.rtmNotification.error;
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

    // 初始化 shape_type_interval 输入框显示状态
    const shapeTypeInterval = document.getElementById('shape_type_interval').value;
    updateIntervalInputFields(shapeTypeInterval);

    // 初始化底边长输入框的显示状态
    const triangleType = document.getElementById('triangle_type').value;
    const baseLengthInput = document.getElementById('triangle_base_length_input');
    if (triangleType === 'isosceles') {
        baseLengthInput.style.display = 'block'; // 显示底边长输入框
    } else {
        baseLengthInput.style.display = 'none'; // 隐藏底边长输入框
    }

    loadRecipeList(); // 初始加载所有配方

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
});

// 处理外部调用选择框变化
function handleExternalCallChange() {
    const externalCallValue = document.getElementById('external-call').value;
    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    
    if (externalCallValue === '1' && recipeNumber && callSignal) {
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
    
    if (!recipeNumber || !callSignal) {
        alertError('请先输入配方号MH和调用信号DI');
        return;
    }
    
    isMonitoring = true;
    console.log('开始外部调用监控...');
    updateStatusDisplay(`监控状态: 正在监控 DI${callSignal} 信号，等待触发...`, 'monitoring');
    
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
    updateStatusDisplay('监控状态: 已停止');
}

// 检查外部调用
function checkExternalCall() {
    const recipeNumber = document.getElementById('recipe-number').value;
    const callSignal = document.getElementById('call-signal').value;
    
    // 如果正在自动写入，则跳过此次检查
    if (isAutoWriting) {
        console.log('正在自动写入中，跳过此次配方调用检查');
        updateStatusDisplay('正在自动写入中，暂停接收新的配方调用...', 'processing');
        return;
    }
    
    fetch('/start_external_call_monitor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mh_number: recipeNumber,
            di_number: callSignal
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('外部调用监控错误:', data.error);
            updateStatusDisplay(`监控错误: ${data.error}`, 'error');
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
            updateStatusDisplay(`检测到触发信号，MH值: ${data.mh_value}，正在加载配方...`, 'triggered');
            
            // 加载配方但不停止监控
            loadRecipeByMHValue(data.mh_value);
            
            // 延迟一下再继续监控，避免重复触发
            setTimeout(() => {
                if (isMonitoring) {
                    updateStatusDisplay(`监控状态: 正在监控 DI${callSignal} 信号，等待下一次触发...`, 'monitoring');
                }
            }, 2000); // 2秒后恢复监控状态显示
        }
    })
    .catch(error => {
        console.error('外部调用监控请求失败:', error);
        updateStatusDisplay(`监控请求失败: ${error.message}`, 'error');
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
                updateStatusDisplay(`配方加载成功: ${targetRecipe.recipeName}`, 'success');
                alertSuccess(`检测到配方调用，配方: ${targetRecipe.recipeName}`);
            }
        } else {
            console.log('未找到配方编号为', mhValue, '的配方');
            console.log('可用的配方编号:', data.recipes.map(r => r.recipeId));
            updateStatusDisplay(`未找到配方编号为 ${mhValue} 的配方`, 'error');
            alertError(`未找到配方编号为 ${mhValue} 的配方`);
        }
    })
    .catch(error => {
        console.error('根据MH值加载配方失败:', error);
        updateStatusDisplay(`加载配方失败: ${error.message}`, 'error');
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
                updateStatusDisplay(`机器人状态检查失败: ${data.error}`, 'error');
                alertError(`机器人状态检查失败: ${data.error}`);
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
                updateStatusDisplay(`检查运行程序失败: ${data.error}`, 'error');
                alertError(`检查运行程序失败: ${data.error}`);
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
            updateStatusDisplay(`配方 ${recipeName} 自动写入完成`, 'success');
            alertSuccess(`配方 ${recipeName} 自动写入成功！`);
            isAutoWriting = false; // 重置写入状态
        })
        .catch(error => {
            console.error('自动写入过程出错:', error);
            updateStatusDisplay(`自动写入失败: ${error.message}`, 'error');
            alertError(`自动写入失败: ${error.message}`);
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

// 动态显示或隐藏输入框
document.getElementById('shape_type_interval').addEventListener('change', function () {
    const shapeTypeInterval = this.value;
    updateIntervalInputFields(shapeTypeInterval);
});

function updateIntervalInputFields(shapeTypeInterval) {
    // 隐藏所有图形输入框
    document.querySelectorAll('.shape-input-interval').forEach(div => div.style.display = 'none');

    // 根据选择的图形类型显示对应的输入框
    if (shapeTypeInterval === 'circle') {
        document.getElementById('circle_input_interval').style.display = 'block';
    } else if (shapeTypeInterval === 'rectangle') {
        document.getElementById('rectangle_input_interval').style.display = 'block';
    }
}

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
    const isConnected = connectButton.textContent === '断开连接';

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
            connectButton.textContent = '连接';
            document.getElementById('robot_status').style.display = 'none';
            document.getElementById('program_input').style.display = 'none'; // 隐藏程序输入框
            document.getElementById('p_data_table_container').style.display = 'none'; // 隐藏P点数据表格
            console.log('机器人已断开连接');
        })
        .catch(error => {
            console.error('断开连接失败:', error.message);
            alertError('断开连接失败: ' + error.message);
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
                connectButton.textContent = '连接';
                return response.json().then(err => {
                    throw new Error(err.error || '连接失败');
                });
            }
            return response.json();
        })
        .then(data => {
            // 更新按钮状态和显示
            connectButton.textContent = '断开连接';
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
        })
        .catch(error => {
            console.error('连接失败:', error.message);
            // 根据错误类型显示不同的提示
            if (error.message === '请求超时') {
                alertError('请求超时: 请检查网络连接或稍后重试');
            } else {
                alertError('连接失败: ' + error.message);
            }
            // 连接失败时，重置按钮状态
            connectButton.textContent = '连接';
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
            cell8.textContent = leftRightValue === 1 ? '右手' : '左手';  // 将1和-1转换为文本描述
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
    rows.forEach(row => {
        const pId = parseInt(row.cells[2].textContent, 10); // P_ID
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
            tf: (pId - 1) % toolCount + 1, // 根据工具数量循环设置TF值
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
    
    // 获取新增输入框的值
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

    // 发送请求到后端写入R寄存器
    fetch('/write_r_registers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            frame_length: frame_length,
            frame_width: frame_width,
            frame_depth: frameDepth,
            shape_height: shapeHeight,
            material_thickness: materialThickness,
            placement_layers: placementLayers,
            total_shapes: shapeCountValue, // 填充数量
            tool_count: toolCount,         // 工具数量
            drop_Count: drop_Count,
            numofsingle_row_columns: shapesPerRowOrColValue,
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
        console.log('R寄存器写入成功');
        alertSuccess('R寄存器写入成功');
        
        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(true, 'R寄存器写入成功', 'R寄存器写入');
        }
    })
    .catch(error => {
        console.error('写入R寄存器失败:', error.message);
        alertError('写入R寄存器失败: ' + error.message);
        
        // 如果有自动写入的回调函数，调用它
        if (window.onWriteOperationComplete) {
            window.onWriteOperationComplete(false, '写入R寄存器失败: ' + error.message, 'R寄存器写入');
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

// 表单提交事件
document.getElementById('interval-calculator-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const shapeType = document.getElementById('shape_type_interval').value;
    let diameter, length, width;

    if (shapeType === 'circle') {
        diameter = parseFloat(document.getElementById('circle_diameter_interval').value);
    } else if (shapeType === 'rectangle') {
        length = parseFloat(document.getElementById('rectangle_length_interval').value);
        width = parseFloat(document.getElementById('rectangle_width_interval').value);
    }

    // 发送请求到后端读取PR寄存器的值
    fetch('/get_pr_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            shape_type: shapeType,
            diameter: diameter,
            length: length,
            width: width
        }),
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || '请求失败');
            });
        }
        return response.json();
    })
    .then(data => {
        const rowSpacing = data.row_spacing;
        const colSpacing = data.col_spacing;
        const pr1X = data.pr1_x;
        const pr1Y = data.pr1_y;
        const pr2X = data.pr2_x;
        const pr2Y = data.pr2_y;
        const pr3X = data.pr3_x;
        const pr3Y = data.pr3_y;

        // 检查行间距和列间距是否为负数
        if (rowSpacing < 0 || colSpacing < 0) {
            document.getElementById('row-spacing').textContent = '计算错误，请检查寄存器值';
            document.getElementById('col-spacing').textContent = '计算错误，请检查寄存器值';
        } else {
            document.getElementById('row-spacing').textContent = rowSpacing.toFixed(2);
            document.getElementById('col-spacing').textContent = colSpacing.toFixed(2);
        }

        // 显示PR寄存器的XY值
        document.getElementById('pr1-x').textContent = pr1X.toFixed(2);
        document.getElementById('pr1-y').textContent = pr1Y.toFixed(2);
        document.getElementById('pr2-x').textContent = pr2X.toFixed(2);
        document.getElementById('pr2-y').textContent = pr2Y.toFixed(2);
        document.getElementById('pr3-x').textContent = pr3X.toFixed(2);
        document.getElementById('pr3-y').textContent = pr3Y.toFixed(2);

        // 显示计算结果
        document.getElementById('interval-result').style.display = 'block';
    })
    .catch(error => {
        console.error('请求失败:', error.message);
        alertError('请求失败: ' + error.message);
    });
});

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

    // 检查图片是否已经生成
    const plotImg = document.getElementById('plot');
    if (!plotImg || !plotImg.getAttribute('data-base64')) {
        alertError('请先生成规划结果图片');
        return;
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
        if (data.exists) {
            // 如果配方文件已存在，弹出确认框
            const confirmOverwrite = await myConfirm('配方名已存在，是否覆盖？');
            if (!confirmOverwrite) {
                return; // 用户取消覆盖，直接返回
            }
        }

        if (data.id_exists) {
            // 如果配方编号已存在，弹出确认框
            const confirmOverwriteId = await myConfirm('配方编号已存在，是否覆盖？');
            if (!confirmOverwriteId) {
                return; // 用户取消覆盖，直接返回
            }
        }

        // 继续保存配方的逻辑
        saveRecipeData(recipeName, recipeId); // 将配方编号传递给保存函数
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

    // 获取其他表单数据
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
    const plotImg = document.getElementById('plot');
    if (!plotImg) {
        console.error('plot element not found when saving recipe');
        return;
    }
    const plotImageBase64 = plotImg.getAttribute('data-base64'); // 使用存储的 Base64 数据
    if (!plotImageBase64) {
        console.error('No base64 data found in plot element when saving recipe');
        return;
    }
    console.log('Saving recipe with base64 data:', plotImageBase64.substring(0, 50) + '...');
    
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
        triangleOrientation: document.getElementById('triangle_orientation')?.value || 'up'
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
        alertSuccess('配方保存成功');
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

                // 创建 <span> 并设置配方编号和配方名
                const recipeIdSpan = document.createElement('span');
                recipeIdSpan.className = 'recipe-id'; // 添加类名
                recipeIdSpan.textContent = recipe.recipeId; // 设置配方编号

                const recipeNameSpan = document.createElement('span');
                recipeNameSpan.className = 'recipe-name'; // 添加类名
                recipeNameSpan.textContent = recipe.recipeName; // 设置配方名

                // 将 <span> 添加到 <li> 中
                li.appendChild(recipeIdSpan);
                li.appendChild(recipeNameSpan);

                // 添加读取按钮
                const readButton = document.createElement('button');
                readButton.textContent = '读取';
                readButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    loadRecipeToPlanning(recipe.recipeName);
                });

                // 添加删除按钮
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '删除';
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
                li.addEventListener('click', () => {
                    previewRecipe(recipe.recipeName);
                });
            });
        })
        .catch(error => console.error('加载配方列表失败:', error));
}

// 将图形类型的英文转换为中文
function getShapeTypeChinese(shapeType) {
    switch (shapeType) {
        case 'circle':
            return '圆形';
        case 'rectangle':
            return '矩形';
        case 'polygon':
            return '多边形';
        case 'triangle':
            return '三角形';
        default:
            return '未知图形';
    }
}

// 将三角形类型和朝向的英文转换为中文
function getTriangleTypeChinese(triangleType) {
    switch (triangleType) {
        case 'equilateral':
            return '等边三角形';
        case 'isosceles':
            return '等腰三角形';
        default:
            return '未知类型';
    }
}

function getTriangleOrientationChinese(orientation) {
    switch (orientation) {
        case 'up':
            return '向上';
        case 'down':
            return '向下';
        case 'left':
            return '向左';
        case 'right':
            return '向右';
        default:
            return '未知朝向';
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
    fetch('/get_recipe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recipeName }),
    })
    .then(response => response.json())
    .then(data => {
        // 更新预览标题，显示配方名称
        const previewTitle = document.querySelector('.recipe-preview h2');
        if (previewTitle) {
            previewTitle.textContent = `配方预览 - ${recipeName}`;
        }

        // 填充料框设置
        document.getElementById('preview-frame-length').textContent = data.frameLength;
        document.getElementById('preview-frame-width').textContent = data.frameWidth;
        document.getElementById('preview-frame-depth').textContent = data.frameDepth;

        // 填充工件设置
        const shapeTypeChinese = getShapeTypeChinese(data.shapeType); // 将图形类型转换为中文
        document.getElementById('preview-shape-type').textContent = shapeTypeChinese;

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
            const triangleTypeChinese = getTriangleTypeChinese(data.triangleType); // 转换为中文
            const triangleOrientationChinese = getTriangleOrientationChinese(data.triangleOrientation); // 转换为中文
            document.getElementById('preview-triangle-type').textContent = triangleTypeChinese || 'N/A';
            document.getElementById('preview-triangle-side-length').textContent = data.triangleSideLength || 'N/A';
            document.getElementById('preview-triangle-orientation').textContent = triangleOrientationChinese || 'N/A';
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

        const layoutTypeChinese = data.layoutType === 'array' ? '阵列式' : '蜂窝式';
        const placeTypeChinese = data.placeType === 'row' ? '行优先' : '列优先';
        const remainderTurnChinese = data.remainderTurn === 'off' ? '关闭' : (data.remainderTurn === 'left' ? '左转90度' : '右转90度');
        document.getElementById('preview-layout-type').textContent = layoutTypeChinese;
        document.getElementById('preview-place-type').textContent = placeTypeChinese;
        document.getElementById('preview-remainder-turn').textContent = remainderTurnChinese;

        // 显示预览图片
        const plotImg = document.getElementById('preview-plot');
        plotImg.src = data.plotImageBase64;
        plotImg.setAttribute('data-base64', data.plotImageBase64); // 添加这行，设置data-base64属性
        plotImg.style.display = 'block';
    })
    .catch(error => console.error('加载配方失败:', error));
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
        // 填充智能规划界面的参数
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
    const externalCallContainer = document.getElementById('external-call-container');
    const autoWriteContainer = document.getElementById('auto-write-container');
    const externalCallStatus = document.getElementById('external-call-status');
    
    // 只有当配方号和调用信号DI都输入了值时才显示选择框
    if (recipeNumber && callSignal) {
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