"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const json_storage_service_1 = require("../common/json-storage.service");
const uuid_1 = require("uuid");
let FormsService = class FormsService {
    storageService;
    formsFile = 'forms';
    submissionsFile = 'form-submissions';
    constructor(storageService) {
        this.storageService = storageService;
    }
    create(createFormDto, userId) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = {
            id: (0, uuid_1.v4)(),
            ...createFormDto,
            status: 'draft',
            shareUrl: this.generateShareUrl(),
            viewCount: 0,
            submitCount: 0,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        forms.push(form);
        this.storageService.write(this.formsFile, forms);
        return form;
    }
    findAll(userId, isAdmin) {
        const forms = this.storageService.read(this.formsFile) || [];
        if (isAdmin) {
            return forms.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return forms
            .filter(form => form.createdBy === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    findOne(id) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = forms.find(f => f.id === id);
        if (!form) {
            throw new Error('表单不存在');
        }
        return form;
    }
    findByShareUrl(shareUrl) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = forms.find(f => f.shareUrl === shareUrl);
        if (!form) {
            throw new Error('表单不存在');
        }
        if (form.status !== 'published') {
            throw new Error('表单未发布');
        }
        form.viewCount++;
        this.storageService.write(this.formsFile, forms);
        return form;
    }
    update(id, updateFormDto, userId, isAdmin) {
        const forms = this.storageService.read(this.formsFile) || [];
        const index = forms.findIndex(f => f.id === id);
        if (index === -1) {
            throw new Error('表单不存在');
        }
        if (!isAdmin && forms[index].createdBy !== userId) {
            throw new Error('无权限修改此表单');
        }
        forms[index] = {
            ...forms[index],
            ...updateFormDto,
            updatedAt: new Date(),
        };
        this.storageService.write(this.formsFile, forms);
        return forms[index];
    }
    remove(id, userId, isAdmin) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = forms.find(f => f.id === id);
        if (!form) {
            throw new Error('表单不存在');
        }
        if (!isAdmin && form.createdBy !== userId) {
            throw new Error('无权限删除此表单');
        }
        const updatedForms = forms.filter(f => f.id !== id);
        this.storageService.write(this.formsFile, updatedForms);
        const submissions = this.storageService.read(this.submissionsFile) || [];
        const updatedSubmissions = submissions.filter(s => s.formId !== id);
        this.storageService.write(this.submissionsFile, updatedSubmissions);
    }
    submit(submitFormDto, ip, userAgent) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = forms.find(f => f.id === submitFormDto.formId);
        if (!form) {
            throw new Error('表单不存在');
        }
        if (form.status !== 'published') {
            throw new Error('表单未发布');
        }
        const settings = form.config.settings || {};
        if (settings.enableTimeLimit) {
            const now = new Date();
            if (settings.startTime && new Date(settings.startTime) > now) {
                throw new Error('表单尚未开放');
            }
            if (settings.endTime && new Date(settings.endTime) < now) {
                throw new Error('表单已结束');
            }
        }
        const submissions = this.storageService.read(this.submissionsFile) || [];
        if (settings.allowDuplicateSubmit === false && ip) {
            const existingSubmission = submissions.find(s => s.formId === submitFormDto.formId && s.ip === ip);
            if (existingSubmission) {
                throw new Error('您已经提交过此表单');
            }
        }
        if (settings.submitLimitType === 'total' && settings.submitLimitCount) {
            if (form.submitCount >= settings.submitLimitCount) {
                throw new Error('表单提交已达上限');
            }
        }
        else if (settings.submitLimitType === 'daily' && settings.submitLimitCount) {
            const today = new Date().toLocaleDateString('zh-CN');
            const todaySubmissions = submissions.filter(s => s.formId === submitFormDto.formId &&
                new Date(s.submittedAt).toLocaleDateString('zh-CN') === today);
            if (todaySubmissions.length >= settings.submitLimitCount) {
                throw new Error('今日提交已达上限');
            }
        }
        const submission = {
            id: (0, uuid_1.v4)(),
            formId: submitFormDto.formId,
            data: submitFormDto.data,
            ip,
            userAgent,
            submittedAt: new Date(),
        };
        submissions.push(submission);
        this.storageService.write(this.submissionsFile, submissions);
        form.submitCount++;
        this.storageService.write(this.formsFile, forms);
        return submission;
    }
    getSubmissions(formId, userId, isAdmin) {
        const forms = this.storageService.read(this.formsFile) || [];
        const form = forms.find(f => f.id === formId);
        if (!form) {
            throw new Error('表单不存在');
        }
        if (!isAdmin && form.createdBy !== userId) {
            throw new Error('无权限查看此表单数据');
        }
        const submissions = this.storageService.read(this.submissionsFile) || [];
        return submissions
            .filter(s => s.formId === formId)
            .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }
    getStatistics(formId, userId, isAdmin) {
        const form = this.findOne(formId);
        if (!isAdmin && form.createdBy !== userId) {
            throw new Error('无权限查看此表单统计');
        }
        const submissions = this.storageService.read(this.submissionsFile) || [];
        const formSubmissions = submissions.filter(s => s.formId === formId);
        const dailyStats = {};
        formSubmissions.forEach(submission => {
            const date = new Date(submission.submittedAt).toLocaleDateString('zh-CN');
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });
        const dailySubmissions = Object.entries(dailyStats)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const conversionRate = form.viewCount > 0
            ? ((form.submitCount / form.viewCount) * 100).toFixed(2)
            : '0.00';
        return {
            submitCount: form.submitCount,
            viewCount: form.viewCount,
            conversionRate,
            dailySubmissions,
            recentSubmissions: formSubmissions.slice(0, 10),
        };
    }
    generateShareUrl() {
        return (0, uuid_1.v4)().substring(0, 8);
    }
    generateMock(count) {
        const forms = this.storageService.read(this.formsFile) || [];
        const mockTitles = [
            '产品体验调研问卷',
            '客户满意度调查',
            '活动报名表',
            '市场调研问卷',
            '用户反馈表',
            '销售线索收集',
            '会议签到表',
            '试用申请表',
        ];
        for (let i = 0; i < count; i++) {
            const form = {
                id: (0, uuid_1.v4)(),
                title: mockTitles[i % mockTitles.length] + ` #${i + 1}`,
                description: '这是一个示例表单，用于收集用户信息',
                config: {
                    components: [
                        {
                            id: (0, uuid_1.v4)(),
                            type: 'input',
                            label: '姓名',
                            placeholder: '请输入您的姓名',
                            required: true,
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            type: 'phone',
                            label: '手机号',
                            placeholder: '请输入手机号',
                            required: true,
                        },
                        {
                            id: (0, uuid_1.v4)(),
                            type: 'email',
                            label: '邮箱',
                            placeholder: '请输入邮箱地址',
                            required: false,
                        },
                    ],
                    style: {
                        pageBackground: i % 2 === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5',
                        backgroundColor: '#ffffff',
                        primaryColor: ['#0052d9', '#1890ff', '#52c41a', '#faad14'][i % 4],
                        borderRadius: '8px',
                    },
                    settings: {
                        submitButtonText: '提交',
                        successMessage: '提交成功，感谢您的参与！',
                        allowDuplicateSubmit: i % 2 === 0,
                        collectUserInfo: ['ip', 'userAgent', 'submitTime'],
                        submitLimitType: 'unlimited',
                        submitLimitCount: 100,
                        enableTimeLimit: false,
                        startTime: '',
                        endTime: '',
                        enableRedirect: false,
                        redirectUrl: '',
                        enableCaptcha: false,
                    },
                },
                status: i % 3 === 0 ? 'draft' : 'published',
                shareUrl: this.generateShareUrl(),
                viewCount: Math.floor(Math.random() * 500),
                submitCount: Math.floor(Math.random() * 200),
                createdBy: 'admin',
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(),
            };
            forms.push(form);
        }
        this.storageService.write(this.formsFile, forms);
        return count;
    }
    clearMock(userId, isAdmin) {
        const forms = this.storageService.read(this.formsFile) || [];
        let updatedForms;
        if (isAdmin) {
            updatedForms = [];
        }
        else {
            updatedForms = forms.filter(form => form.createdBy !== userId);
        }
        const deletedCount = forms.length - updatedForms.length;
        this.storageService.write(this.formsFile, updatedForms);
        return deletedCount;
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [json_storage_service_1.JsonStorageService])
], FormsService);
//# sourceMappingURL=forms.service.js.map