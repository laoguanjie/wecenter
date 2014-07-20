<?php
/*
+--------------------------------------------------------------------------
|   WeCenter [#RELEASE_VERSION#]
|   ========================================
|   by WeCenter Software
|   © 2011 - 2013 WeCenter. All Rights Reserved
|   http://www.wecenter.com
|   ========================================
|   Support: WeCenter@qq.com
|   
+---------------------------------------------------------------------------
*/

if (!defined('IN_ANWSION'))
{
	die;
}

class active_class extends AWS_MODEL
{
	public function active_code_generate()
	{
		return substr(strtolower(md5(uniqid(rand()))), 0, 20);
	}

	public function active_code_active($active_code, $active_type_code)
	{
		if (!$active_type_code)
		{
			return false;
		}
		
		if (!$active_info = $this->fetch_row('active_data', "active_type_code = '" . $this->quote($active_type_code) . "' AND active_code = '" . $this->quote($active_code) . "' AND ((active_time is NULL AND active_ip is NULL) OR (active_time = '' AND active_ip = ''))"))
		{
			return false;
		}
		
		$this->update('active_data', array(
			'active_time' => time(),
			'active_ip' => time(),
		), 'active_id = ' . intval($active_info['active_id']));
		
		switch ($active_type_code)
		{
			case 'VALID_EMAIL':
			case 'FIND_PASSWORD':
				return $active_info['uid'];
			break;		
		}
		
		return true;
	}

	public function new_active_code($uid, $expire_time, $active_code, $active_type_code = null)
	{
		if ($active_id = $this->insert('active_data', array(
			'uid' => intval($uid),
			'expire_time' => intval($expire_time),
			'active_code' => $active_code,
			'active_type_code' => $active_type_code,
			'add_time' => time(),
			'add_ip' => ip2long(fetch_ip())
		)))
		{
			$this->delete('active_data', "uid = " . intval($uid) . " AND active_type_code = '" . $this->quote($active_type) . "' AND active_id <> " . intval($active_id));
		}
		
		return $active_id;
	
	}
	
	public function get_active_code($active_code, $active_type_code = null)
	{
		if (!$active_code)
		{
			return false;
		}
		
		return $this->fetch_row('active_data', "active_code = '" . $this->quote($active_code) . "' AND active_type_code = '" . $this->quote($active_type_code) . "'");
	
	}
	
	public function new_valid_email($uid, $email = null)
	{
		if (!$uid)
		{
			return false;
		}
		
		$active_code_hash = $this->active_code_generate();
		
		$active_id = $this->new_active_code($uid, (time() + 60 * 60 * 24), $active_code_hash, 'VALID_EMAIL');

		if ($email)
		{
			$uid = $email;
		}
		
		return $this->model('email')->action_email('VALID_EMAIL', $uid, get_js_url('/account/valid_email_active/key-' . $active_code_hash));
	}
	
	public function new_find_password($uid)
	{
		if (!$uid)
		{
			return false;
		}
		
		$active_code_hash = $this->active_code_generate();
		
		$active_id = $this->model('active')->new_active_code($uid, (time() + 60 * 60 * 24), $active_code_hash, 'FIND_PASSWORD');
		
		return $this->model('email')->action_email('FIND_PASSWORD', $uid, get_js_url('/account/find_password/modify/key-' . $active_code_hash));
	}
	
	public function clean_expire()
	{
		return $this->delete('active_data', 'expire_time < ' . time());
	}
	
	public function set_user_email_valid_by_uid($uid)
	{
		return $this->update('users', array(
			'valid_email' => 1,
		), 'uid = ' . intval($uid));
	}
	
	public function active_user_by_uid($uid)
	{
		return $this->update('users', array(
			'group_id' => 4,
		), 'uid = ' . intval($uid));
	}
}