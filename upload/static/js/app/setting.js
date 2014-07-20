$(function(){
	//页面初始化加载教育经历
	if (typeof education_experience_list != 'undefined')
	{
		$.each(education_experience_list,function(i, e){
			$('.aw-user-educate table tbody').append('<tr data-id="'+e.education_id+'">'+Hogan.compile(AW_TEMPLATE.educateInsert).render({
				'school' : e.school_name,
				'departments' : e.departments,
				'year' : e.education_years
			})+'</tr>');
		});
	}
	
	//页面初始化加载工作经历
	if (typeof work_experience_list != 'undefined')
	{
		$.each(work_experience_list,function(i, e){
			$('.aw-user-work table tbody').append('<tr data-id="'+e.work_id+'">'+Hogan.compile(AW_TEMPLATE.workInsert).render({
				'company' : e.company_name,
				'workid' : e.work_id,
				'work' : e.job_name,
				'syear' : e.start_year,
				'eyear' : e.end_year
			})+'</tr>');
		});
	}

	//教育经历添加
	$('.add-educate').click(function()
	{
		var _this = $(this),
			school = $(this).parents('tr').find('.school').val(),
			departments = $(this).parents('tr').find('.departments').val(),
			year = $(this).parents('tr').find('.year').val();
		//发送请求
		$.post(G_BASE_URL+"/account/ajax/add_edu/",{'school_name':school,'education_years':year,'departments':departments},function(result){
			if (result.errno != 1)
			{
				$.alert(result.err);
			}else{
				_this.parents('tbody').append('<tr class="hide" data-id="'+ result.rsm.id+'">'+Hogan.compile(AW_TEMPLATE.educateInsert).render({
					'school' : school,
					'departments' : departments,
					'year' : year
				})+'</tr>');
				_this.parents('tbody').find('tr.hide').fadeIn();
				_this.parents('tr').find('.school,.departments,.year').val('');
			}
		},'json');
	});
	//教育经历删除
	$(document).on('click','.delete-educate',function()
	{
		var _this = $(this),
			eduid = _this.parents('tr').attr('data-id');
		$(this).parents('tr').fadeOut('slow',function(){
			_this.parents('tr').detach();
		});
		$.post(G_BASE_URL+"/account/ajax/remove_edu/" + eduid,{'id':eduid});
	});
	//教育经历编辑
	$(document).on('click','.edit-educate',function()
	{
		var syear = $(this).parents('tr').find('.e3').attr('data-txt');
		$(this).parents('tr').html(Hogan.compile(AW_TEMPLATE.educateEdit).render({
				'school' : $(this).parents('tr').find('.e1').attr('data-txt'),
				'departments' : $(this).parents('tr').find('.e2').attr('data-txt')
			}));
		$('.edityear').append($('.aw-user-setting-reset-table .year option').clone());
		$('.edityear').val(syear);
	});
	//教育经历保存
	$(document).on('click','.save-educate',function()
	{
		var _this = $(this),
			school = $(this).parents('tr').find('.school').val(),
			departments = $(this).parents('tr').find('.departments').val(),
			year = $(this).parents('tr').find('.edityear').val(),
			eduid = $(this).parents('tr').attr('data-id');
		$.post(G_BASE_URL+"/account/ajax/edit_edu/" + eduid,{'school_name':school,'education_years':year,'departments':departments},function(result){
			if (result.errno != 1)
			{
				$.alert(result.err);
			}else
			{
				_this.parents('tr').html(Hogan.compile(AW_TEMPLATE.educateInsert).render({
					'school' : school,
					'departments' : departments,
					'year' : year
				}));
			}
		},'json');
	});
	//工作经历添加
	$('.add-work').click(function()
	{
		var _this = $(this),
			company = $(this).parents('tr').find('.company').val(),
			workid = $(this).parents('tr').find('.work').val(),
			work = $(this).parents('tr').find('.work option[value="'+workid+'"]').text(),
			syear = $(this).parents('tr').find('.syear').val(),
			eyear = $(this).parents('tr').find('.eyear').val();
		$.post(G_BASE_URL+"/account/ajax/add_work/",{'company_name':company,'job_id':workid,'start_year':syear,'end_year':eyear},function(result){
			if (result.errno != 1)
			{
				$.alert(result.err);
			}else
			{
				_this.parents('tbody').append('<tr class="hide" data-id="'+result.rsm.id+'">'+Hogan.compile(AW_TEMPLATE.workInsert).render({
					'company' : company,
					'work' : work,
					'syear' : syear,
					'eyear' : eyear,
					'workid' : workid
				})+'</tr>');
				_this.parents('tbody').find('tr.hide').fadeIn();
				_this.parents('tr').find('.company,.work,.syear,.eyear').val('');
			}
		},'json');
	});

	//工作经历编辑
	$(document).on('click','.edit-work',function()
	{
		var work = $(this).parents('tr').find('.w2').attr('data-txt'),
			syear = $(this).parents('tr').find('.w3').attr('data-s-val'),
			eyear = $(this).parents('tr').find('.w3').attr('data-e-val');
		$(this).parents('tr').html(Hogan.compile(AW_TEMPLATE.workEidt).render({
				'company' : $(this).parents('tr').find('.w1').attr('data-txt')
			}));
		$('.editwork').append($('.aw-user-setting-reset-table .work option').clone());
		$('.editsyear').append($('.aw-user-setting-reset-table .syear option').clone());
		$('.editeyear').append($('.aw-user-setting-reset-table .eyear option').clone());
		$('.editwork').val(work);
		$('.editsyear').val(syear);
		$('.editeyear').val(eyear);

	});
	//工作经历保存
	$(document).on('click','.save-work',function()
	{
		var _this = $(this),
			company = $(this).parents('tr').find('.company').val(),
			syear = $(this).parents('tr').find('.editsyear').val(),
			eyear = $(this).parents('tr').find('.editeyear').val(),
			workEditId  = $(this).parents('tr').attr('data-id'),
			workid = $(this).parents('tr').find('.editwork').val(),
			work = $(this).parents('tr').find('.work option[value="'+workid+'"]').text();
		$.post(G_BASE_URL+"/account/ajax/edit_work/"+workEditId,{'company_name':company,'job_id':workid,'start_year':syear,'end_year':eyear},function(result){
			if (result.errno != 1)
			{
				$.alert(result.err);
			}else
			{
				_this.parents('tr').html(Hogan.compile(AW_TEMPLATE.workInsert).render({
					'company' : company,
					'work' : work,
					'workid' : workid,
					'syear' : syear,
					'eyear' : eyear
				}));
			}
		},'json');
	});
	//工作经历删除
	$(document).on('click','.delete-work',function()
	{
		var _this = $(this),
			workid = $(this).parents('tr').attr('data-id');
		$(this).parents('tr').fadeOut('slow',function(){
			_this.parents('tr').detach();
		});
		$.post(G_BASE_URL+"/account/ajax/remove_work/" + workid,{'id':$(this).parents('tr').attr('data-id')});
	});




});