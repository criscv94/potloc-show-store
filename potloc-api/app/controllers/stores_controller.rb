# frozen_string_literal: true

class StoresController < ApplicationController
  def index
    @stores = Store.all
    render json: StoreSerializer.new(@stores), status: 200
  end
end
