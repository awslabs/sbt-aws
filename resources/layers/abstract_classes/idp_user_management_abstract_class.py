# Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
# SPDX-License-Identifier: Apache-2.0

import abc
class IdpUserManagementAbstractClass (abc.ABC):
    
    @abc.abstractmethod
    def create_user(self, event):
        pass
    
    @abc.abstractmethod
    def get_users(self, event):
        pass
    
    @abc.abstractmethod
    def get_user(self, event):
        pass
    
    @abc.abstractmethod
    def update_user(self, event):
        pass
    
    @abc.abstractmethod
    def disable_user(self, event):
        pass
    
    @abc.abstractmethod
    def enable_user(self, event):
        pass

    @abc.abstractmethod
    def delete_user(self, event):
        pass